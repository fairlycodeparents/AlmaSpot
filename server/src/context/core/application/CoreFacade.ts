import { ActivityManagementService } from "./services/ActivityManagementService";
import { RoomSearchService } from "./services/RoomSearchService";
import {
  ActivityDTO,
  ActivityTypeDTO,
  CreateActivityDTO,
  ExternalActivityDTO,
  InternalActivityDTO,
} from "./dtos/ActivityDTO";
import { Period } from "../../../shared/domain/Period";
import { Campus, Site } from "../../../shared/domain/Location";
import {
  Activity,
  ActivityType,
  ExternalActivity,
  InternalActivity,
} from "../domain/model/Activity";
import { RoomAvailabilityDTO } from "./dtos/RoomAvailabilityDTO";

export class CoreFacade {
  constructor(
    private roomSearchService: RoomSearchService,
    private activityManagementService: ActivityManagementService,
  ) {}

  async findAvailableRoomsByCampus(
    campusName: string,
    start: Date,
    end: Date,
  ): Promise<RoomAvailabilityDTO[]> {
    const period = new Period(start, end);
    const campus = campusName as Campus;
    return this.roomSearchService.findSlotsByCampus(campus, period);
  }

  async findAvailableRoomsBySite(
    campus: string,
    address: string,
    start: Date,
    end: Date,
  ): Promise<RoomAvailabilityDTO[]> {
    const period = new Period(start, end);
    const site = new Site(campus as Campus, address);
    return this.roomSearchService.findSlotsBySite(site, period);
  }

  async createExternalActivity(
    token: string,
    dto: CreateActivityDTO,
  ): Promise<void> {
    const period = new Period(dto.startTime, dto.endTime);

    const activityDomain: ExternalActivity = {
      roomId: dto.roomId,
      campus: dto.campus,
      title: dto.title,
      period,
      type: ActivityType.EXTERNAL_ACTIVITY,
      description: dto.description,
      authorId: dto.authorId,
    };

    await this.activityManagementService.createEvent(token, activityDomain);
  }

  async getActivitiesByDate(
    campusName: string,
    date: Date,
  ): Promise<ActivityDTO[]> {
    const campus = campusName as Campus;
    const activities =
      await this.roomSearchService.getActivitiesInDateAndCampus(campus, date);
    return activities.map((activity: Activity) =>
      this.mapActivityToDTO(activity),
    );
  }

  private mapActivityToDTO(activity: Activity): ActivityDTO {
    const base = {
      id: activity.id!,
      roomId: activity.roomId,
      title: activity.title,
      startTime: activity.period.start,
      endTime: activity.period.end,
    };

    if (activity.type === ActivityType.INTERNAL_ACTIVITY) {
      const internalActivity = activity as InternalActivity;
      return {
        ...base,
        type: ActivityTypeDTO.INTERNAL_ACTIVITY,
        courseId: internalActivity.courseId,
        professors: internalActivity.professor,
      } as InternalActivityDTO;
    } else {
      const externalActivity = activity as ExternalActivity;
      return {
        ...base,
        type: ActivityTypeDTO.EXTERNAL_ACTIVITY,
        description: externalActivity.description,
        authorId: externalActivity.authorId,
      } as ExternalActivityDTO;
    }
  }
}
