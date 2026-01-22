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
    const eventPeriod = new Period(
      event.payload.startTime,
      event.payload.endTime,
    );
    const interestedRecords = await this.subRepo.findByRoomAndPeriod(
      event.payload.roomId,
      eventPeriod,
    );
    if (interestedRecords.length === 0) return;
    const notificationPromises = interestedRecords.map(async (record) => {
      const { subscription, details } = record;
      const conflictingSlot = subscription.plan.slots.find((slot) => {
        return (
          slot.roomId === event.payload.roomId &&
          slot.period.start < eventPeriod.end &&
          slot.period.end > eventPeriod.start
        );
      });
      const formatTime = (date: Date) =>
        date.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        });

      if (!conflictingSlot) {
        console.warn(`[Warn] No slot found for ${subscription.studentId}`);
        return;
      }
      const slotStart = formatTime(conflictingSlot.period.start);
      const slotEnd = formatTime(conflictingSlot.period.end);

      const message = `Una nuova attività '${event.payload.title}' si sovrappone al tuo studio delle ${slotStart}-${slotEnd}.`;
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
