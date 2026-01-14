import {
  UserRequest,
  AvailableRoom,
  Suggestion,
} from "context/search/domain/Entities";

/** External port for AI interactions */
export interface AI {
  /**
   * Get a query by interpreting the user input (which is written in natural language).
   * @param conversation - Array of user input strings
   * @returns an `UserRequest` constructed from user input
   */
  extractRequest(conversation: string[]): Promise<UserRequest>;

  /**
   * Get a suggestion by combining multiple slots, considering any specific request from the user.
   * @param conversation - Array of user input strings
   * @param availableSlots - Array of available rooms
   * @returns a `Suggestion` containing the plan and response
   */
  getSuggestion(
    conversation: string[],
    availableSlots: AvailableRoom[],
  ): Promise<Suggestion>;
}

/** External port for room availability */
export interface RoomAvailability {
  /**
   * Get an array of available rooms, based on the provided request criteria.
   * @param request - The availability request
   * @returns an array of `AvailableRoom` matching the request
   */
  getAvailableRooms(request: UserRequest): Promise<AvailableRoom[]>;
}
