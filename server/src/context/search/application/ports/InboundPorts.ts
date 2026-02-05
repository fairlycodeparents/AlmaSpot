import { SearchRequestDTO, SuggestionDTO } from "../DTOs";

/** It is responsible for handling the search of plans based on user input. */
export interface SearchUseCase {
  /**
   * Searches and suggests a plan based on the user's request.
   * @param request - The request the user made.
   * @returns A promise that resolves to a suggestion.
   */
  search(request: SearchRequestDTO): Promise<SuggestionDTO>;
}
