import { Campus } from "shared/domain/Location";
import { Period } from "shared/domain/Period";
import { Plan } from "shared/domain/Plan";

/** Domain entity representing a suggestion made by the AI. */
export class Suggestion {
  /**
   * Creates a new `Suggestion` instance.
   * @param plan - The proposed {@link Plan}.
   * @param response - The AI's textual response to the user's request.
   */
  constructor(
    public readonly plan: Plan,
    public readonly response: string,
  ) {}
}

/** Domain entity representing a user's request for room availability. */
export class AvailabilityQuery {
  /**
   * Creates a new `UserRequest` instance.
   * @param period - The time {@link Period} for which availability is being queried.
   * @param campus - The campus where the availability is being queried.
   * @param address - Optional address within the campus.
   */
  constructor(
    public readonly period: Period,
    public readonly campus: Campus,
    public readonly address?: string,
  ) {}
}

/** Domain entity representing an available room. */
export class RoomAvailable {
  /**
   * Creates a new `RoomAvailable` instance.
   * @param id - The identifier of the room.
   * @param type - The type of the room.
   * @param address - The address or location of the room.
   * @param from - The start date and time of availability.
   * @param to - The end date and time of availability.
   */
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly address: string,
    public readonly from: Date,
    public readonly to: Date,
  ) {}
}
