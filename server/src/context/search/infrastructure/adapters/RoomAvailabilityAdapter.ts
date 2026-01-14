import { RoomAvailability } from "context/search/application/ExternalPorts";
import {
  AvailabilityQuery,
  RoomAvailable,
} from "context/search/domain/Entities";
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

  async getAvailableSlots(query: AvailabilityQuery): Promise<RoomAvailable[]> {
    const response = query.address
      ? await this.core.findAvailableRoomsBySite(
          query.campus,
          query.address,
          query.period.start,
          query.period.end,
        )
      : await this.core.findAvailableRoomsByCampus(
          query.campus,
          query.period.start,
          query.period.end,
        );

    return response.flatMap((roomAvailability) =>
      roomAvailability.availableSlots.map(
        (slot) =>
          new RoomAvailable(
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
