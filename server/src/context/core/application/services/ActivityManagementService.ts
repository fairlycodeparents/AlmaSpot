import { ActivityType, ExternalActivity } from "../../domain/model/Activity";
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

  private readonly STALE_THRESHOLD = 6 * 60 * 60 * 1000;

  async syncEvent(campus: Campus, date: Date): Promise<void> {
    const dateKey = date.toISOString().split("T")[0];
    const syncKey = `${campus}-${dateKey}`;

    const lastSyncDate = await this.roomRepository.getLastSync(campus, date);
    const now = Date.now();
    const lastSyncTime = lastSyncDate ? lastSyncDate.getTime() : 0;

    const needsUpdate =
      !lastSyncDate || now - lastSyncTime > this.STALE_THRESHOLD;

    const syncTask = async () => {
      try {
        const activities = await this.uniboProvider.fetchInternalActivities(
          campus,
          date,
        );
        await this.roomRepository.updateInternalActivities(
          campus,
          date,
          activities,
        );
        await this.roomRepository.setLastSync(campus, new Date());
      } catch (error) {
        console.error(`[SYNC ERROR] Sync failed for ${campus}:`, error);
        if (needsUpdate) throw error;
      } finally {
        this.activeFetches.delete(syncKey);
      }
    };

    if (this.activeFetches.has(syncKey)) {
      const existingPromise = this.activeFetches.get(syncKey)!;
      if (needsUpdate) {
        await existingPromise;
      }
      return;
    }

    const promise = syncTask();
    this.activeFetches.set(syncKey, promise);

    if (needsUpdate) {
      await promise;
    } else {
      promise.catch((err) => console.error("[BG Error]", err));
    }
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
    await this.notifyEvent(domainEvent);
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
  }

  async notifyEvent(event: ActivityAddedEvent): Promise<void> {
    await this.eventBus.publish(event);
  }
}
