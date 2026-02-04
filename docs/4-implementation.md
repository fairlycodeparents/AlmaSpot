# 4. Implementation

#### Index

1. [Analysis](1-analysis.md)
2. [Design](2-design.md)
3. [Architecture](3-architecture.md)
4. [Implementation](4-implementation.md)
   - 4.1 [Technologies](#41-technologies)
   - 4.2 [Core System](#42-core-system)
     - 4.2.1 [Domain Layer](#421-domain-layer)
     - 4.2.2 [Application Layer](#422-application-layer)
     - 4.2.3 [Infrastructure Layer](#423-infrastructure-layer)
     - 4.2.4 [Anti Corruption Layer](#424-anti-corruption-layer)
     - 4.2.5 [Advanced Spatial Management](#425-advanced-spatial-management)
   - 4.3 [Notification System](#43-notification-system)
   - 4.4 [Authentication System](#44-authentication-system)
   - 4.5 [AI Assistant Integration](#45-ai-assistant-integration)
     - 4.4.1 [Intent Extraction and RAG-inspired Workflow](#451-intent-extraction-and-rag-inspired-workflow)
     - 4.4.2 [Structured Output via Function Calling](#452-structured-output-via-function-calling)
5. [DevOps](5-devops.md)
6. [License](6-license.md)
7. [Deployment](7-deployment.md)

### 4.1 Technologies

#### MEVN

- **MongoDB**: NoSQL database used for data persistence management and storage of documents in a JSON-like format;
- **Express**: web framework for Node.js used for managing routing and abstracting HTTP requests and responses within controllers;
- **Node.js**: runtime environment used for the development of the server component (backend);
- **Vue.js**: progressive framework used on the frontend for creating the user interface based on reactive components.

#### Docker

Docker was adopted as a containerization platform to standardize the development and deployment environment.
Through the creation of isolated _containers_ for each service, it was possible to include all dependencies necessary
for software execution.
The use of Docker ensures project replicability across different machines, eliminating operating system compatibility
issues and ensuring consistency between the local development environment and the production one.

#### Go

The Go language was introduced into the technology stack to handle a service dedicated to high-performance
data retrieval.
Specifically, this module handles interactions with the university web portal to extract and process information
regarding lesson schedules and room availability. The choice of Go for this task was dictated by its efficiency in
network operations and its ability to handle concurrency natively, allowing for rapid processing of external data
before sending it to the main system.

#### Other technologies used

- **argon2**: Library used for password hashing. It guarantees advanced protection against brute-force and rainbow
  table attacks.

- **c8**: Tool for code coverage analysis that leverages the native features of the Node.js V8 engine. It was used to
  measure test effectiveness, generating detailed reports that highlight well-verified code portions and those with
  insufficient coverage.

- **dotenv**: Module that loads environment variables from a `.env` file into `process.env`. It is fundamental for
  separating sensitive configurations (such as API keys and credentials) from the source code.

- **genai** (Google Generative AI): Client SDK used to integrate generative artificial intelligence features
  (Gemini models) within the application, allowing for content generation or semantic analysis.

- **jsonwebtoken**: Implementation for token signing, decoding, and verification. Used to handle _stateless_
  authentication and the secure exchange of information between client and server.

- **mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js. It provides a schema-based solution to
  model application data, handling validation, type conversion, and business logic.

- **nginx**: Web server and _reverse proxy_ configured to serve static files produced by Vite and to manage
  request routing, ensuring scalability and correct path resolution for Single Page
  Application (SPA).

- **pinia**: The official _State Management_ library for Vue.js. Used to handle the global application state
  (e.g., user data, tokens) in a reactive and modular way, facilitating data sharing between components.

- **postcss**: Tool for transforming CSS via JavaScript plugins. In the project, it serves as a processor to compile
  Tailwind CSS and ensure cross-browser compatibility.

- **storybook**: Open source tool for UI component development that acts as a laboratory and interactive documentation.
  It allows verifying component states and accessibility outside the main application, ensuring that the design system
  defined in Tailwind CSS is applied correctly on all elements.

- **tailwindcss**: CSS framework that allows building user interfaces quickly directly in the markup. It offers a
  consistent design system and drastically reduces the need to write custom stylesheets, optimizing the final bundle by
  removing unused classes.

- **typescript**: A strongly typed programming language based on JavaScript. TypeScript code is converted to JavaScript
  , allowing it to run wherever JavaScript runs.

- **uuid**: Tool for generating UUIDs (Universally Unique Identifiers) compliant with RFC 4122. It is used to create
  unique global identifiers.

- **web-push**: Library supporting the Web Push protocol for sending notifications to users. It handles VAPID key
  generation and interaction with browser Push Services.

- **vite**: New generation build tool for the frontend. It provides a rapid and optimized development environment for
  web applications.

- **zod**: Schema validation library that extends type safety to runtime. Since TypeScript static checks disappear
  after compilation, Zod helps verify that data coming from the client respects the expected format, preventing errors
  that TypeScript could not intercept.

### 4.2 Core System

The implementation of the core system focuses on managing the lifecycle of academic activities and the availability of
physical spaces. It acts as the definitive "_source of truth_", reconciling static spatial data (classrooms) with dynamic
schedule information through a robust set of adapters and services.

#### 4.2.1 Time management

A central challenge was ensuring reliable time comparisons across the system. The implementation of the `Period` object
(found in `shared/domain/Period.ts`) centralizes this logic to prevent inconsistencies in availability queries.

- **Overlap logic**: Instead of scattering conditional checks throughout the services, the Period class implements a
  dedicated method to detect time collisions.

- **Immutability**: To prevent side effects during complex filtering operations, Period is implemented as an immutable
  value object.

```typescript
export class Period {
  constructor(
    readonly start: Date,
    readonly end: Date,
  ) {
    if (start >= end) {
      throw new Error("Invalid period: start must be before end.");
    }
  }

  overlapsWith(other: Period): boolean {
    return this.start < other.end && this.end > other.start;
  }
}
```

#### 4.2.2 Room search

The `RoomSearchService` handles the task of finding free "spots" by cross-referencing static data from MongoDB with
dynamic activities.

The algorithm retrieves active activities for the requested day and performs multi-level filtering. It does not simply
verify the existence of a room; it performs a real-time difference between `Room` entities and the `Activity` collection.

```typescript
private isRoomAvailable(room: Room, requestedPeriod: Period): boolean {
  const hasConflict = room.activities.some((activity) =>
          activity.period.overlapsWith(requestedPeriod)
  );
  return !hasConflict;
}
```

#### 4.2.3 Synchronization strategies

The `ActivityManagementService` implements a **reactive synchronization** pattern to manage integration with the
university.

To mitigate high latency and potential downtime of university APIs, the service does not act as a simple proxy. The
implementation follows an "on-demand" retrieval logic with functional caching: data retrieved from the
`UniboProviderHTTP` is normalized and maintained in a local state, which reduces external calls and ensures system
operation even if the external provider is unreachable.

#### 4.2.4 Anti-Corruption Layer

Integration with external university data is managed via `UniboProviderHTTP`, which serves as a bridge to the Go
microservice (`unibo-provider`). The adapter transforms heterogeneous data (often inconsistent in room names or date
formats) into the clean domain model through the `ActivityMapper`.

```typescript
async getActivities(date: Date): Promise<InternalActivity[]> {
  const formattedDate = date.toISOString().split("T")[0];
  const response = await axios.get(
    `${this.baseUrl}/activities?date=${formattedDate}`
  );

  return response.data.map((dto: any) =>
    ActivityMapper.toDomain(dto)
  );
}
```

#### 4.2.5 Persistence with native MongoDB driver

A key implementation choice was using the native MongoDB driver instead of heavy ORMs, for two main reasons:

- **Query optimization**: In `MongoRoomRepository`, the native driver allows granular control over collections organized
  by campus (Bologna, Cesena, etc.).
- **Geographic hierarchy**: By leveraging MongoDB's dot-notation, the system queries nested fields (Campus $\rightarrow$
  Branch $\rightarrow$ Room) with minimal overhead; the implementation can thus query nested properties to allow
  targeted searches without performance degradation.

#### 4.2.6 Seeding system

A relevant implementation detail is the `SeedRooms` script. Unlike standard seeding, this engine handles the
transformation of structured JSON files into complex documents. Its main functions are:

- **Document transformation**: It processes campus-specific files (e.g., `cesena_rooms.json`), reconstructing the
  `Location` object hierarchy.

- **Clean-and-load strategy**: To ensure consistency across development environments, the script clears orphaned
  collections before loading, ensuring the integrity of geographic references in MongoDB.

#### 4.2.7 Asynchronous notification

The `publish` method adopts a **fire-and-forget** strategy. Once an event is emitted (e.g., `ActivityAddedEvent`), the bus
distributes it in a separate micro-task, immediately returning success to the user regardless of the processing
time of the subscribers (`notification system`).

```typescript
export class InMemoryEventBus implements EventBus {
  private bus: EventEmitter = new EventEmitter();

  async publish(events: DomainEvent[]): Promise<void> {
    events.forEach((event) => {
      this.bus.emit(event.eventName, event);
    });
  }
}
```

### 4.3 Notification System

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

Subsequently, it opens the application by appending parameters to the URL, allowing the frontend to immediately display
the details of the issue upon startup.

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

### 4.4 Authentication System

Authentication is handled by the **AuthService**, which is responsible for protecting sensitive data and managing
sessions. This service encapsulates cryptographic operations, ensuring secure password storage and preventing plain-text
persistence.

#### Password Hashing

To manage credential storage, the **Argon2id** algorithm was selected. As the winner of the _Password Hashing
Competition_, it represents the current standard in security. Unlike older predecessors like BCrypt, **Argon2id**
introduces **memory-hardness**, a complexity based on memory usage that mitigates the effectiveness of dedicated
hardware, making _brute-force_ attacks computationally expensive.

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

Authentication is handled in a _stateless_ manner using **JSON Web Tokens (JWT)**. Upon successful login (but not during
registration), the server generates a signed token containing the user ID, email, role (currently limited to _admin_ in
this version), and an expiration time. This approach eliminates the need to maintain session state on the server side.

##### Data Validation and Integrity

To preserve domain integrity, a declarative validation mechanism was implemented using the **Zod** library. This allows
for the definition of schemas that serve as strict contracts for input data.
Consequently, malformed requests are intercepted and rejected immediately, preventing invalid data from entering the
database.

#### Registration Schema

The `signUpSchema` registration schema implements both syntactic and domain-specific rules. Specifically, a constraint
was imposed on application administrators regarding the email address, which must belong to the institutional domain—in
this case, the University of Bologna.

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

### 4.5 AI Assistant Integration

The "Assistant" feature provides a conversational interface that enables students to locate study rooms by using natural
language. It is implemented using Google Gemini (specifically the `gemini-2.5-flash(-lite)` model) via an Adapter
Pattern.
This architectural choice decouples the domain logic from the specific LLM provider, ensuring maintainability and
allowing for future model substitutions without affecting the core business rules.

#### 4.5.1 Intent Extraction and RAG-inspired Workflow

Unlike standard chatbots, the system cannot rely solely on the model's pre-trained knowledge because it requires
real-time access to classroom availability. To address this issue, the `SearchService` implements a synchronous pipeline
inspired by the [Retrieval-Augmented Generation (RAG)](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)
pattern.

1. **Parameter Extraction**: The service first invokes the AI in "extractor" mode. The model then extracts structured
   search parameters (campus, start time, and end time) from the unstructured user input by analyzing the conversation
   history (`ChatMessageDTO[]`). If some parameters are missing, the model returns a message asking the user for
   clarification.
2. **Availability Check**: The extracted parameters are used to query the internal `RoomAvailability` port. This step
   retrieves the actual list of available slots from the database or external providers.
3. **Suggestion Generation**: The system invokes the AI a second time in "suggester" mode and injects the retrieved room
   data into the system context. The model then selects the best options and generates a natural language response and a
   structured plan.

#### 4.5.2 Structured Output via Function Calling

To ensure reliable interaction between the LLM and the application front end, we
use [function calling](https://ai.google.dev/gemini-api/docs/function-calling?example=meeting). Rather than parsing
unpredictable raw text responses, the system forces the model to communicate via strict JSON schemas defined with
[Zod](https://zod.dev), used to validate types at runtime.

The `AIAdapter` configures the model to use only specific "tools" (such as `define_plan` or `availability_query`). This
ensures that the output always adheres to the expected format, assuring type safety and consistency, and enabling
seamless integration with other components. An example of these schemas is shown below:

```typescript
PLAN_DECLARATION = {
  name: "define_plan",
  description: "Proposed room allocation plan.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      slots: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            roomId: {
              type: Type.STRING,
              description: "Identifier of the room",
            },
            start: {
              type: Type.STRING,
              description: "ISO 8601 start datetime",
            },
            end: { type: Type.STRING, description: "ISO 8601 end datetime" },
          },
          required: ["roomId", "start", "end"],
        },
      },
      message_to_user: {
        type: Type.STRING,
        description: "Answer for the user: explain the plan briefly",
      },
    },
    required: ["slots", "message_to_user"],
  },
};
```

The following code snippet shows how the adapter enforces this structured communication.

```typescript
// AIAdapter.ts implementation detail
const response = await this.ai.models.generateContent({
  model: this.MODEL_NAME,
  contents: this.buildContents(history),
  config: {
    // We define the specific tool structure the model must use
    tools: [{ functionDeclarations: [this.PLAN_DECLARATION] }],
    // We inject the real-time data into the prompt context and configure behavior (text instructions).
    systemInstruction: this.buildSystemInstruction("SUGGESTER", availableRooms),
    toolConfig: {
      functionCallingConfig: {
        // Forces the model to generate a structured plan
        mode: FunctionCallingConfigMode.ANY,
        allowedFunctionNames: ["define_plan"],
      },
    },
  },
});
```
