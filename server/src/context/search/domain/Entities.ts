import { Campus } from "../../../shared/domain/Location";
import { Period } from "../../../shared/domain/Period";
import { Plan } from "../../../shared/domain/Plan";

/** Domain entity representing a suggestion made by the AI. */
export class Suggestion {
  /**
   * Creates a new `Suggestion` instance.
   * @param response - The AI's textual response to the user's request.
   * @param plan - The proposed {@link Plan}.
   */
  constructor(
    public readonly response: string,
    public readonly plan?: RoomSlot[],
  ) {}
}

/** Domain entity representing a user's request for room availability. */
export class UserRequest {
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

/** Domain entity representing a room slot. */
export class RoomSlot {
  /**
   * Creates a new `RoomSlot` instance.
   * @param id - The identifier of the room.
   * @param name - The name of the room.
   * @param type - The type of the room.
   * @param campus - The campus where the room is located.
   * @param address - The address or location of the room.
   * @param from - The start date and time of the slot.
   * @param to - The end date and time of the slot.
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly campus: string,
    public readonly address: string,
    public readonly from: Date,
    public readonly to: Date,
  ) {}
}
