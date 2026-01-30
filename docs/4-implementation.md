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
