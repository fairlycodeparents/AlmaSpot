import { SearchRequestDTO, SuggestionDTO } from "./DTOs";
import { AI, RoomAvailability } from "./ExternalPorts";
import { Suggestion } from "../domain/Entities";
import { Plan } from "../../../shared/domain/Plan";

/**
 * Service responsible for handling the search of plans based on user input.
 * It interacts with AI and RoomAvailability to process user requests and provide suitable room suggestions.
 */
export class SearchPlanService {
  private ai: AI;
  private availability: RoomAvailability;

  /**
   * Constructor for `SearchPlanService`.
   * @param ai - An instance of `AI` port, used to process user input and generate plans.
   * @param availability - An instance of `RoomAvailability` port, to check for available rooms.
   */
  constructor(ai: AI, availability: RoomAvailability) {
    this.ai = ai;
    this.availability = availability;
  }

  /**
   * Searches and suggests a plan based on the user's request.
   * @param request - The request the user made.
   * @returns A promise that resolves to a suggestion.
   */
  async search(request: SearchRequestDTO): Promise<SuggestionDTO> {
    const query = await this.ai.extractRequest(request.userMessages);

    if (typeof query === "string") {
      return new Suggestion(new Plan([]), query);
    }

    const availableRooms = await this.availability.getAvailableRooms(query);
    return await this.ai.getSuggestion(request.userMessages, availableRooms);
  }
}
