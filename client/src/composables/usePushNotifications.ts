import { ref } from "vue";

/**
 * Converts a Vapid Key (base64 string) to a Uint8Array used by the browser.
 * @param vapidKey to convert
 */
function urlBase64ToUint8Array(vapidKey: string) {
  const padding = "=".repeat((4 - (vapidKey.length % 4)) % 4);
  const base64 = (vapidKey + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Generates or retrieves a unique device ID stored in localStorage.
 */
function getOrCreateDeviceId() {
  const KEY = "almaspot_student_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : "user-" + Date.now();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * Composable for managing push notifications subscription.
 */
export function usePushNotifications() {
  const isSupported = ref(
    "serviceWorker" in navigator && "PushManager" in window,
  );
  const isSubscribed = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const subscribeToPush = async (userPlan: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      const permission = await Notification.requestPermission();
      if (permission !== "granted")
        throw new Error("Notification permission not granted");

      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("No VAPID KEY found");

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const payload = {
        subscription: {
          studentId: getOrCreateDeviceId(),
          plan: userPlan,
        },
        details: {
          type: "WEB_PUSH",
          endpoint: pushSubscription.endpoint,
          keys: pushSubscription.toJSON().keys,
        },
      };

      const apiUrl = "/api/notifications";
      const res = await fetch(`${apiUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server error details:", errorData);
        throw new Error("Error in server subscription");
      }
      isSubscribed.value = true;
    } catch (err: any) {
      console.error(err);
      error.value = err.message || "An unknown error occurred";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    error,
    subscribeToPush,
  };
}
