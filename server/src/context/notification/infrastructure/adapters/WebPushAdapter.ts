import webpush from "web-push";
import { NotificationSender } from "../../domain/ports/NotificationSender";
import { Notification } from "../../domain/model/Notification";
import { DeliveryDetails } from "../../domain/ports/SubscriptionRepository";

export class WebPushAdapter implements NotificationSender {
  constructor() {
    const publicKey = process.env["VAPID_PUBLIC_KEY"];
    const privateKey = process.env["VAPID_PRIVATE_KEY"];
    const subject = process.env["VAPID_SUBJECT"];
    if (!publicKey || !privateKey || !subject) {
      throw new Error("FATAL: VAPID keys are missing in environment variables");
    }
    webpush.setVapidDetails(subject, publicKey, privateKey);
  }

  async send(
    notification: Notification,
    details: DeliveryDetails,
  ): Promise<void> {
    if (details.type !== "WEB_PUSH") {
      throw new Error(
        `WebPushAdapter cannot handle delivery type: ${details.type}`,
      );
    }
    const pushSubscription = {
      endpoint: details.endpoint,
      keys: details.keys,
    };
    const payload = JSON.stringify({
      //TODO: add icon and data
      title: "AlmaSpot",
      body: notification.message,
    });
    try {
      await webpush.sendNotification(pushSubscription, payload);
    } catch (error: any) {
      console.error(
        `[WebPushAdapter] Error sending to ${details.endpoint.slice(0, 20)}...`,
        error.statusCode,
      );
      throw error;
    }
  }
}
