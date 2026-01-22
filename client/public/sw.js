self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "AlmaSpot";
  const options = {
    body: payload.body || "Nuovo aggiornamento!",
    data: payload.data || { url: "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

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
