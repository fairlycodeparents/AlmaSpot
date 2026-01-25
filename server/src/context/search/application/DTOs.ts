/**
 * DTOs for RoomSlot and PlanSlot
 */
export interface PlanSlot {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly campus: string;
  readonly address: string;
  readonly from: Date;
  readonly to: Date;
}

/**
 * DTOs for Suggestion response
 */
export interface SuggestionDTO {
  readonly plan: PlanSlot[];
  readonly response: string;
}

/**
 * DTO for search request
 */
export interface SearchRequestDTO {
  readonly userMessages: string[];
}
