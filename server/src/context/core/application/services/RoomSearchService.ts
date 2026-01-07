import { RoomRepository } from "../../domain/ports/RoomRepository";
import { ActivityManagementService } from "./ActivityManagementService";
import { Room } from "../../domain/model/Room";
import { Period } from "../../../../shared/domain/Period";
import { Campus } from "../../../../shared/domain/Location";

export class RoomSearchService {
  constructor(
    private roomRepository: RoomRepository,
    private activityManagementService: ActivityManagementService,
  ) {}

  async findFreeRoomGivenPeriod(
    campus: Campus,
    period: Period,
  ): Promise<Room[] | null> {
    await this.activityManagementService.syncEvent(campus, period.date);

    const allRooms = await this.roomRepository.getRoomsByCampus(campus);
    const allActivities =
      await this.roomRepository.getActivitiesByCampusAndDate(
        campus,
        period.date,
      );

    const busyRoomsIds = new Set<string>();

    for (const activity of allActivities) {
      if (activity.period.overlaps(period)) {
        busyRoomsIds.add(activity.roomId);
      }
    }

    return allRooms.filter((room) => !busyRoomsIds.has(room.id));
  }
}
