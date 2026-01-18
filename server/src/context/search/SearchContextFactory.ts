import { CoreFacade } from "context/core";
import { SearchPlanService } from "./application/SearchPlanService";
import { AIAdapter } from "./infrastructure/adapters/AIAdapter";
import { RoomAvailabilityAdapter } from "./infrastructure/adapters/RoomAvailabilityAdapter";

/** Factory class for creating instances of SearchPlanService with necessary dependencies. */
export class SearchContextFactory {
  /**
   * Creates an instance of SearchPlanService with required adapters.
   * @param coreFacade - The core facade to be used by the RoomAvailabilityAdapter.
   */
  static create(coreFacade: CoreFacade): SearchPlanService {
    const ai = new AIAdapter();
    const availability = new RoomAvailabilityAdapter(coreFacade);

    return new SearchPlanService(ai, availability);
  }
}
