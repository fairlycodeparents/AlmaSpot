import { RoomSlot } from "../domain/Entities";

/**
 * DTOs for Suggestion response
 */
export interface SuggestionDTO {
  readonly plan: RoomSlot[];
  readonly response: string;
}

/**
 * DTO for search request
 */
export interface SearchRequestDTO {
  readonly userMessages: string[];
}
