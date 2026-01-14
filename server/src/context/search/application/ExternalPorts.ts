import { Slot } from "shared/domain/Slot";
import {
  AvailabilityQuery,
  RoomAvailable,
  Suggestion,
} from "context/search/domain/Entities";

/** External port for AI interactions */
export interface AI {
  /**
   * Get a query by interpreting the user input (which is written in natural language).
   * @param userInput - Array of user input strings
   * @returns an `AvailabilityQuery` constructed from user input
   */
  getQueryGivenUserInput(userInput: string[]): Promise<AvailabilityQuery>;

  /**
   * Get a suggestion by combining multiple slots, considering any specific request from the user.
   * @param userInput - Array of user input strings
   * @param availableSlots - Array of available room slots
   * @returns a `Suggestion` containing the plan and response
   */
  getPlanGivenUserInput(
    userInput: string[],
    availableSlots: Slot[],
  ): Promise<Suggestion>;
}

/** External port for room availability */
export interface RoomAvailability {
  /**
   * Get an array of available (rooms) slots, based on the provided query criteria.
   * @param query - The availability query
   * @returns Array of available `Slot`
   */
  getAvailableSlots(query: AvailabilityQuery): Promise<RoomAvailable[]>;
}
