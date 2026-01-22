import {
  ActivityType,
  ExternalActivity,
  InternalActivity,
} from "../../domain/model/Activity";
import { Campus } from "../../../../shared/domain/Location";
import { AuthService } from "../../domain/ports/ServicePorts";
import { EventBus } from "../../../../shared/domain/EventBus";
import { ActivityAddedEvent } from "../../domain/events/ActivityAddedEvent";
import { UniboProviderHTTP } from "../../infrastructure/adapters/UniboProviderHTTP";
import { MongoRoomRepository } from "../../infrastructure/persistence/mongo/MongoRoomRepository";

export class ActivityManagementService {
  private activeFetches: Map<string, Promise<void>> = new Map();
  constructor(
    private roomRepository: MongoRoomRepository,
    private uniboProvider: UniboProviderHTTP,
    private authService: AuthService,
    private eventBus: EventBus,
  ) {}

  async syncEvent(campus: Campus, date: Date): Promise<void> {
    const lastSync = await this.roomRepository.getLastSync(campus, date);
    const now = new Date();
    if (lastSync && now.getTime() - lastSync.getTime() < 3600000) {
      console.log("Sync skipped, caching.");
      return;
    }

    const dateKey = date.toISOString().split("T")[0];
    const lockKey = `${campus}_${dateKey}`;

    if (this.activeFetches.has(lockKey)) {
      console.log("Sync already in progress for", lockKey);
      return this.activeFetches.get(lockKey)!;
    }

    const syncTask = (async () => {
      try {
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
        await this.roomRepository.setLastSync(campus, date);
        console.log("[Sync] Completed for campus:", campus);
      } catch (error) {
        console.error("[Sync] Error during synchronization:", error);
        throw error;
      } finally {
        this.activeFetches.delete(lockKey);
      }
    })();
    this.activeFetches.set(lockKey, syncTask);
    await syncTask;
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
      activityId: event.id,
      roomId: event.roomId,
      campus: event.campus,
      title: event.title,
      startTime: event.period.start,
      endTime: event.period.end,
    });
    console.log("[Event Created] External event created with ID:", event.id);
    await this.notifyEvent(domainEvent, event.id);
  }

  async deleteEvent(token: string, activityId: string): Promise<void> {
    if (!this.authService.validateAdminToken(token)) {
      throw new Error("Unauthorized: Invalid admin token.");
    }

    const activity = await this.roomRepository.getActivityById(activityId);
    if (!activity) {
      throw new Error("Not Found: External activity does not exist.");
    }
    if (activity.type !== ActivityType.EXTERNAL_ACTIVITY) {
      throw new Error("Bad Request: Cannot delete internal activities.");
    }
    const now = new Date();
    if (activity.period.start.getTime() <= now.getTime()) {
      throw new Error("Bad Request: Cannot delete past or ongoing activities.");
    }

    await this.roomRepository.deleteExternalActivity(activityId);
    console.log("[Event Deleted] External event deleted with ID:", activityId);
  }

  async notifyEvent(
    event: ActivityAddedEvent,
    id: string | undefined,
  ): Promise<void> {
    await this.eventBus.publish(event);
    console.log(
      "[Event Published] External event published on event bus with ID:",
      id,
    );
  }
}
