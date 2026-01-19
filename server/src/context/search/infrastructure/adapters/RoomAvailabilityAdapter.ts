import { RoomAvailability } from "context/search/application/ports/OutboundPorts";
import { UserRequest, AvailableRoom } from "context/search/domain/Entities";
import { CoreFacade } from "context/core";

/**
 * Adapter for room availability, implementing the RoomAvailability external port.
 * This adapter interacts with the core context to fetch available room slots based on the provided query.
 */
export class RoomAvailabilityAdapter implements RoomAvailability {
  private core: CoreFacade;

  constructor(core: CoreFacade) {
    this.core = core;
  }

  async getAvailableRooms(request: UserRequest): Promise<AvailableRoom[]> {
    const response = request.address
      ? await this.core.findAvailableRoomsBySite(
          request.campus,
          request.address,
          request.period.start,
          request.period.end,
        )
      : await this.core.findAvailableRoomsByCampus(
          request.campus,
          request.period.start,
          request.period.end,
        );

    return response.flatMap((roomAvailability) =>
      roomAvailability.availableSlots.map(
        (slot) =>
          new AvailableRoom(
            roomAvailability.room.id,
            roomAvailability.room.type,
            roomAvailability.room.site.address,
            slot.period.start,
            slot.period.end,
          ),
      ),
    );
  }
}
