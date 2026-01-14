import { Room } from "../model/Room";
import { Site, Campus } from "../../../../shared/domain/Location";
import {
  Activity,
  InternalActivity,
  ExternalActivity,
} from "../model/Activity";

export interface RoomRepository {
  getRooms(): Promise<Room[]>;
  getRoomsByCampus(campus: Campus): Promise<Room[]>;
  getRoomsBySite(site: Site): Promise<Room[]>;

  getEventsPerRoom(roomId: string, date?: Date): Promise<Activity[]>;
  getRoomCampus(roomId: string): Promise<Campus | null>;
  getRoomSite(roomId: string): Promise<Site | null>;

  getActivitiesByCampusAndDate(campus: Campus, date: Date): Promise<Activity[]>;

  saveExternalActivity(activity: ExternalActivity): Promise<void>;
  deleteExternalActivity(activityId: string): Promise<void>;
  updateInternalActivities(
    campus: Campus,
    date: Date,
    activities: InternalActivity[],
  ): Promise<void>;

  getLastSync(campus: Campus, date: Date): Promise<Date | null>;
  setLastSync(campus: Campus, date: Date): Promise<void>;
}
