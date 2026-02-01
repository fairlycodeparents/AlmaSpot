import { MongoRoomRepository } from "../../infrastructure/persistence/mongo/MongoRoomRepository";
import { ActivityManagementService } from "./ActivityManagementService";
import { Period } from "../../../../shared/domain/Period";
import { Campus, Site } from "../../../../shared/domain/Location";
import { Activity } from "../../domain/model/Activity";
import { RoomAvailabilityDTO } from "../dtos/RoomAvailabilityDTO";
import { Slot } from "../../../../shared/domain/Slot";
import { RoomTypeDTO } from "../dtos/RoomDTO";
import { Room, RoomType } from "../../domain/model/Room";

export class RoomSearchService {
  constructor(
    private roomRepository: MongoRoomRepository,
    private activityManagementService: ActivityManagementService,
  ) {}

  async findExactSlotsByCampus(
    campus: Campus,
    searchPeriod: Period,
  ): Promise<RoomAvailabilityDTO[]> {
    const allRoomsAvailability = await this.syncAndGetAvailability(
      campus,
      searchPeriod,
    );
    return allRoomsAvailability.filter((roomAvailability) =>
      roomAvailability.availableSlots.some(
        (slot) =>
          slot.period.start.getTime() <= searchPeriod.start.getTime() &&
          slot.period.end.getTime() >= searchPeriod.end.getTime(),
      ),
    );
  }

  async findSlotsByCampus(
    campus: Campus,
    searchPeriod: Period,
  ): Promise<RoomAvailabilityDTO[]> {
    return this.syncAndGetAvailability(campus, searchPeriod);
  }

  async findSlotsBySite(
    site: Site,
    searchPeriod: Period,
  ): Promise<RoomAvailabilityDTO[]> {
    return this.syncAndGetAvailability(site.campus, searchPeriod).then(
      (allRoomsAvailability) => {
        return allRoomsAvailability.filter(
          (roomAvailability) => roomAvailability.room.site === site,
        );
      },
    );
  }

  async getActivitiesInDateAndCampus(
    campus: Campus,
    date: Date,
  ): Promise<Activity[]> {
    await this.activityManagementService.syncEvent(campus, date);
    return this.roomRepository.getActivitiesByCampusAndDate(campus, date);
  }

  private async syncAndGetAvailability(
    campus: Campus,
    period: Period,
  ): Promise<RoomAvailabilityDTO[]> {
    if (this.isWeekend(period.date)) {
      return [];
    }
    await this.activityManagementService.syncEvent(campus, period.date);
    const allRooms = await this.roomRepository.getRoomsByCampus(campus);
    const allActivities =
      await this.roomRepository.getActivitiesByCampusAndDate(
        campus,
        period.date,
      );
    return this.getRoomAvailability(allRooms, allActivities, period);
  }

  private calculateFreePeriods(
    range: Period,
    activities: Activity[],
  ): Period[] {
    const sortedActivities = activities.sort(
      (a, b) => a.period.start.getTime() - b.period.start.getTime(),
    );

    const freePeriods: Period[] = [];
    let cursor = new Date(range.start);

    for (const activity of sortedActivities) {
      if (activity.period.start > cursor) {
        const endOfSlot =
          activity.period.start > range.end ? range.end : activity.period.start;
        freePeriods.push(new Period(cursor, endOfSlot));
      }
      if (activity.period.end > cursor) {
        cursor = activity.period.end;
      }
    }

    if (cursor < range.end) {
      freePeriods.push(new Period(cursor, range.end));
    }
    return freePeriods;
  }

  private getRoomAvailability(
    allRooms: Room[],
    allActivities: Activity[],
    searchPeriod: Period,
  ): RoomAvailabilityDTO[] {
    const result: RoomAvailabilityDTO[] = [];
    for (const room of allRooms) {
      const roomActivities = allActivities.filter(
        (a) => a.roomId === room.id && a.period.overlaps(searchPeriod),
      );
      const freePeriods = this.calculateFreePeriods(
        searchPeriod,
        roomActivities,
      );

      if (freePeriods.length > 0) {
        const slots = freePeriods.map((period) => new Slot(room.id, period));
        result.push({
          room: {
            id: room.id,
            name: room.name,
            type:
              room.type === RoomType.CLASSROOM
                ? RoomTypeDTO.CLASSROOM
                : RoomTypeDTO.LABORATORY,
            campus: room.campus,
            site: room.site,
          },
          availableSlots: slots,
        });
      }
    }
    return result;
  }

  private isWeekend = (date: Date): boolean => {
    return date.getDay() === 0 || date.getDay() === 6;
  };
}
