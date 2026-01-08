import { Notification } from "../model/Notification";

export interface NotificationSender {
  send(notification: Notification): Promise<void>;
}
