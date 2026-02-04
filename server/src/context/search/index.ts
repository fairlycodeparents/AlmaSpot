import { CoreFacade } from "../core";
import { SearchService } from "./application/SearchService";
import { AIAdapter } from "./infrastructure/adapters/AIAdapter";
import { RoomAvailabilityAdapter } from "./infrastructure/adapters/RoomAvailabilityAdapter";
import { SearchController } from "./infrastructure/web/SearchController";
import { SearchRoutes } from "./infrastructure/web/SearchRoutes";

export type { SuggestionDTO, SearchRequestDTO } from "./application/DTOs";
export { SearchRoutes } from "./infrastructure/web/SearchRoutes";

/**
 * Factory function to create and configure the Search context components.
 * @param coreFacade - The core facade to be used by the adapters.
 * @returns An instance of `SearchRoutes` with all dependencies properly injected.
 */
export function create(coreFacade: CoreFacade): SearchRoutes {
  const aiAdapter = new AIAdapter();
  const roomAdapter = new RoomAvailabilityAdapter(coreFacade);
  const service = new SearchService(aiAdapter, roomAdapter);
  const controller = new SearchController(service);
  return new SearchRoutes(controller);
}
