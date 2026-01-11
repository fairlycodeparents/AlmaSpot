import { NotificationService } from "../NotificationService";
import { ActivityAddedEvent } from "../../../core";

export class ActivityAddedListener {
  constructor(private service: NotificationService) {}

  async on(event: ActivityAddedEvent): Promise<void> {
    console.log(
      `[Listener] Processing event for room: ${event.payload.roomId}`,
    );
    try {
      await this.service.handleActivityAdded(event);
    } catch (error) {
      console.error(
        `[Listener Error] Failed to handle ${event.eventName}`,
        error,
      );
    }
  }
}
