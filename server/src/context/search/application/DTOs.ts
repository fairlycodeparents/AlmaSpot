import { Plan } from "../../../shared/domain/Plan";

/**
 * DTOs for Suggestion response
 */
export interface SuggestionDTO {
  readonly plan: Plan;
  readonly response: string;
}

/**
 * DTO for search request
 */
export interface SearchRequestDTO {
  readonly userMessages: string[];
}
