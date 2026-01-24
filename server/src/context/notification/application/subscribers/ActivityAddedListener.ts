import { NotificationService } from "../NotificationService";
import { ActivityAddedEvent } from "../../../core";

export class ActivityAddedListener {
  constructor(private service: NotificationService) {}

  async on(event: ActivityAddedEvent): Promise<void> {
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
