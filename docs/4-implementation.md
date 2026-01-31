# 4. Implementation

#### Index

1. [Analysis](1-analysis.md)
2. [Design](2-design.md)
3. [Architecture](3-architecture.md)
4. [Implementation](4-implementation.md)
   - 4.1 [Notification System](#41-notification-system)
5. [DevOps](5-devops.md)
6. [License](6-license.md)

### 4.1 Notification System

The notification system is designed to alert students in real-time when a new activity overlaps with their study plan.
The architecture follows an **event-driven** approach and uses the **Web Push** standard
to ensure message delivery even when the application is not active in the foreground.

When a student generates a plan and enables notifications, the client sends the server the plan details and
the device's cryptographic keys (_endpoint_ and _VAPID p256dh/auth keys_).
Data is stored in MongoDB, and a compound index (`roomId`, `startTime`) is applied to the collection
to guarantee reduced response times even with a large number of active subscriptions.

The system reacts asynchronously to the creation of new activities.
At the core of the communication is an _in-memory Event Bus_ based on Node.js _EventEmitter_,
which allows decoupling the room management module from the notification service.

When an administrator inserts an activity, a domain event (_ActivityAddedEvent_) is published on the bus.
This event is intercepted by the _ActivityAddedListener_, which triggers the conflict detection logic.

Once the affected students are identified, the actual delivery is delegated to the _WebPushAdapter_.
This component uses the _web-push_ library and the configured _VAPID_ keys to send the encrypted payload
to the browser's push service, setting the urgency header to "high".
Requests towards the _Push Service_ are parallelized to ensure that a delivery failure to a single device
does not compromise delivery to other users.

The service also handles automatic database cleanup: if sending fails with a _410 Gone_ error
(indicating the user revoked permissions or the device is no longer valid),
the subscription is automatically removed.

Client-side, reception is handled by a **Service Worker** (`sw.js`).
The Service Worker wakes up, decodes the JSON payload, and displays the system notification to the user.

```javascript
self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "AlmaSpot";
  const options = {
    body: payload.body || "New update!",
    data: payload.data || { url: "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
```

Subsequently, it opens the application by appending parameters to the URL, allowing the frontend to immediately display the details of the issue upon startup.

```javascript
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  let targetUrl = event.notification.data.url || "/";
  const body = event.notification.body || "";
  const timeRegex = /(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/;
  const match = body.match(timeRegex);
  let timeSlot = "";
  if (match) {
    timeSlot = match[0];
    const params = new URLSearchParams();
    if (timeSlot) {
      params.append("alert", "true");
      params.append("timeSlot", timeSlot);
    }
    const separator = targetUrl.includes("?") ? "&" : "?";
    targetUrl += separator + params.toString();
  }
  event.waitUntil(clients.openWindow(targetUrl));
});
```

### 4.2 Authentication System

Authentication is handled by the **AuthService**, which is responsible for protecting sensitive data and managing sessions. This service encapsulates cryptographic operations, ensuring secure password storage and preventing plain-text persistence.

#### Password Hashing

To manage credential storage, the **Argon2id** algorithm was selected. As the winner of the _Password Hashing Competition_, it represents the current standard in security. Unlike older predecessors like BCrypt, **Argon2id** introduces **memory-hardness**, a complexity based on memory usage that mitigates the effectiveness of dedicated hardware, making _brute-force_ attacks computationally expensive.

The configuration adopted in the project includes:

- **Type**: `argon2id` (a hybrid of argon2i and argon2d).
- **Memory Cost**: 2^16 KB (64 MB), making the use of massive parallel hardware for cracking expensive.
- **Time Cost**: 3 iterations, to increase the computation time required for each login attempt.

The following code shows the implementation of the authentication service:

```typescript
export class AuthService implements AuthInputPort {
  private readonly HASH_CONFIG = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  };

  async login(email: string, password: string): Promise<string> {
    const admin = await this.repo.findByEmail(email);
    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await argon2.verify(admin.hashedPassword, password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // ... token generation
  }
}
```

#### Session Management

Authentication is handled in a _stateless_ manner using **JSON Web Tokens (JWT)**. Upon successful login (but not during registration), the server generates a signed token containing the user ID, email, role (currently limited to _admin_ in this version), and an expiration time. This approach eliminates the need to maintain session state on the server side.

##### Data Validation and Integrity

To preserve domain integrity, a declarative validation mechanism was implemented using the **Zod** library. This allows for the definition of schemas that serve as strict contracts for input data.
Consequently, malformed requests are intercepted and rejected immediately, preventing invalid data from entering the database.

#### Registration Schema

The `signUpSchema` registration schema implements both syntactic and domain-specific rules. Specifically, a constraint was imposed on application administrators regarding the email address, which must belong to the institutional domain—in this case, the University of Bologna.

The implemented rules include:

- **Email Format Validation**: Standard RFC 5322 verification.
- **Domain Constraint**: The email must end with `@unibo.it`.
- **Password Requirements**: Minimum length of 8 characters and maximum of 100, and must contain at least one number.

The definition of the Zod schema used:

```typescript
import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format")
      // University specific domain rule
      .endsWith("@unibo.it", {
        message: "Email must be a unibo.it address",
      }),

    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password too long")
      .regex(/\d/, "Password must contain at least one number"),
  })
  .strict(); // Reject fields not provided for in the schema
```
