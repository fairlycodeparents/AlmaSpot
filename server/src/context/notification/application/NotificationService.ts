import { NotificationSender } from "../domain/ports/NotificationSender";
import {
  DeliveryDetails,
  SubscriptionRepository,
} from "../domain/ports/SubscriptionRepository";
import { ActivityAddedEvent } from "../../core";
import { Notification } from "../domain/model/Notification";
import { Period } from "../../../shared/domain/Period";
import { Subscription } from "../domain/model/Subscription";
import { Plan } from "../../../shared/domain/Plan";

export class NotificationService {
  constructor(
    private notificationSender: NotificationSender,
    private subRepo: SubscriptionRepository,
  ) {}

  async handleActivityAdded(event: ActivityAddedEvent): Promise<void> {
    const records = await this.subRepo.findAll();
    const interestedRecords = records.filter((record) =>
      record.subscription.isInterestedIn(
        event.payload.roomId,
        new Period(event.payload.startTime, event.payload.endTime),
      ),
    );
    if (interestedRecords.length === 0) return;
    const notificationPromises = interestedRecords.map(async (record) => {
      const { subscription, details } = record;
      const message = `Una nuova attività '${event.payload.title}' si sovrappone con il tuo piano`;
      const notification = new Notification(
        subscription.studentId,
        message,
        new Date(),
        "PENDING",
      );
      try {
        await this.notificationSender.send(notification, details);
        notification.status = "SENT";
        return { status: "fulfilled", subId: subscription.studentId };
      } catch (error: any) {
        throw { subId: subscription.studentId, error };
      }
    });

    const results = await Promise.allSettled(notificationPromises);
    for (const result of results) {
      if (result.status === "rejected") {
        const { subId, error } = result.reason;
        if (error.message === "DEVICE_GONE" || error.statusCode === 410) {
          console.warn(`[Cleanup] Device ${subId} is dead. Removing from DB.`);
          this.subRepo
            .delete(subId)
            .catch((err) => console.error("Failed to delete sub", err));
        } else {
          console.error(`[Error] Failed to send to ${subId}:`, error.message);
        }
      }
    }
  }

  async subscribe(
    studentId: string,
    planData: Plan,
    details: DeliveryDetails,
  ): Promise<void> {
    const subscription = new Subscription(studentId, planData);
    await this.subRepo.save(subscription, details);
  }
}
