import { RoomRepository } from "../../domain/ports/RoomRepository";
import {
  ExternalActivity,
  InternalActivity,
} from "../../domain/model/Activity";
import { Campus } from "../../../../shared/domain/Location";
import {
  UniboProvider,
  NotificationService,
  AuthService,
} from "../../domain/ports/ServicePorts";
import { EventBus } from "../../../../shared/domain/EventBus";
import { ActivityAddedEvent } from "../../domain/events/ActivityAddedEvent";

export class ActivityManagementService {
  constructor(
    private roomRepository: RoomRepository,
    private uniboProvider: UniboProvider,
    private notificationService: NotificationService,
    private authService: AuthService,
    private eventBus: EventBus,
  ) {}

  async syncEvent(campus: Campus, date: Date): Promise<void> {
    const lastSync = await this.roomRepository.getLastSyncTime(campus);
    const now = new Date();
    if (lastSync && now.getTime() - lastSync.getTime() < 3600000) {
      console.log("Sync skipped, caching.");
      return;
    }

    console.log(
      "[Sync] Fetching internal activities for campus:",
      campus,
      "on date:",
      date,
    );
    const internalActivities: InternalActivity[] =
      await this.uniboProvider.fetchInternalActivities(campus, date);
    await this.roomRepository.updateInternalActivities(
      campus,
      date,
      internalActivities,
    );
    await this.roomRepository.setLastSyncTime(campus);
    console.log("[Sync] Completed for campus:", campus);
  }

  async createEvent(token: string, event: ExternalActivity): Promise<void> {
    if (!this.authService.validateAdminToken(token)) {
      throw new Error("Unauthorized: Invalid admin token.");
    }

    const existingEvents = await this.roomRepository.getEventsPerRoom(
      event.roomId,
      event.period.date,
    );
    const hasConflict = existingEvents.some((e) =>
      e.period.overlaps(event.period),
    );

    if (hasConflict) {
      throw new Error(
        "Conflict detected: Event overlaps with existing events.",
      );
    }

    await this.roomRepository.saveExternalActivity(event);

    const domainEvent = new ActivityAddedEvent({
      activityId: event.id || "generated-id",
      roomId: event.roomId,
      campus: event.campus,
      title: event.title,
      startTime: event.period.start,
      endTime: event.period.end,
      description: event.description,
    });
    await this.eventBus.publish(domainEvent);
    //await this.notifyEvent(event); va fatto comunque?
    console.log(
      "[Event Created & Published] External event created and published on event bus with ID:",
      event.id,
    );
  }

  async notifyEvent(event: ExternalActivity): Promise<void> {
    await this.notificationService.sendEventNotification(event);
    console.log("[Notification] Sending notification for event ID:", event.id);
  }
}
