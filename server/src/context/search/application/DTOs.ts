/** DTOs for building a plan suggestion */
export interface PlanSlot {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly campus: string;
  readonly address: string;
  readonly from: Date;
  readonly to: Date;
}

/** DTO for Suggestion response */
export interface SuggestionDTO {
  readonly plan: PlanSlot[];
  readonly response: string;
}

/** DTO for chat message */
export interface ChatMessageDTO {
  readonly role: "user" | "model";
  readonly content: string;
}

/** DTO for search request */
export interface SearchRequestDTO {
  readonly history: ChatMessageDTO[];
}
