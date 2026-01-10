import { Notification } from "../model/Notification";
import { DeliveryDetails } from "./SubscriptionRepository";

export interface NotificationSender {
  send(notification: Notification, details: DeliveryDetails): Promise<void>;
}
