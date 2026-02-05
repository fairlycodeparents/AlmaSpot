import { UserRequest, RoomSlot } from "../../domain/Entities";
import { ChatMessageDTO, SuggestionDTO } from "../DTOs";

/** External port for AI interactions */
export interface AI {
  /**
   * Get a query by interpreting the user input (which is written in natural language).
   * @param history - Array of chat messages
   * @returns an `UserRequest` constructed from user input or a string error message
   */
  extractRequest(history: ChatMessageDTO[]): Promise<UserRequest | string>;

  /**
   * Get a suggestion by combining multiple slots, considering any specific request from the user.
   * @param history - Array of chat messages
   * @param availableRooms - Array of available rooms
   * @returns a `Suggestion` containing the plan and response
   */
  getSuggestion(
    history: ChatMessageDTO[],
    availableRooms: RoomSlot[],
  ): Promise<SuggestionDTO>;
}

/** External port for room availability */
export interface RoomAvailability {
  /**
   * Get an array of available rooms, based on the provided request criteria.
   * @param request - The availability request
   * @returns an array of `RoomSlot` matching the request
   */
  getAvailableRooms(request: UserRequest): Promise<RoomSlot[]>;
}
