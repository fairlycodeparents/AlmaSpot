import { AvailableRoom } from "../domain/Entities";

/**
 * DTOs for Suggestion response
 */
export interface SuggestionDTO {
  readonly plan: AvailableRoom[];
  readonly response: string;
}

/**
 * DTO for search request
 */
export interface SearchRequestDTO {
  readonly userMessages: string[];
}
