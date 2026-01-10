import { NotificationSender } from "../domain/ports/NotificationSender";
import { SubscriptionRepository } from "../domain/ports/SubscriptionRepository";
import { ActivityAddedEvent } from "../../core";
import { Notification } from "../domain/model/Notification";
import { Period } from "../../../shared/domain/Period";
import { PushKeys, Subscription } from "../domain/model/Subscription";
import { Plan } from "../../../shared/domain/Plan";

export class NotificationService {
  constructor(
    private notificationSender: NotificationSender,
    private subRepo: SubscriptionRepository,
  ) {}

  async handleActivityAdded(event: ActivityAddedEvent): Promise<void> {
    const subscriptions = await this.subRepo.findAll();
    const interestedSubs = subscriptions.filter((sub) =>
      sub.isInterestedIn(
        event.payload.roomId,
        new Period(event.payload.startTime, event.payload.endTime),
      ),
    );
    if (interestedSubs.length === 0) return;

    const notificationPromises = interestedSubs.map(async (sub) => {
      const message = `Una nuova attività '${event.payload.title}' si sovrappone con il tuo piano`;
      const notification = new Notification(
        sub.studentId,
        message,
        new Date(),
        "PENDING",
      );

      try {
        await this.notificationSender.send(notification);
        notification.status = "SENT";
        return { status: "fulfilled", subId: sub.studentId };
      } catch (error) {
        throw { subId: sub.studentId, error };
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
    keys: PushKeys,
  ): Promise<void> {
    const subscription = new Subscription(studentId, planData, keys);
    await this.subRepo.save(subscription);
  }
}
