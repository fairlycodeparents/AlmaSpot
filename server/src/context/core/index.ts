export { CoreFacade } from "./application/CoreFacade";
export { CoreContextFactory } from "./CoreContextFactory";
export { CoreController } from "./infrastructure/web/CoreController";
export { CoreRoutes } from "./infrastructure/web/CoreRoutes";

export type { RoomDTO, RoomTypeDTO } from "./application/dtos/RoomDTO";
export type {
  ActivityDTO,
  ActivityTypeDTO,
  CreateActivityDTO,
  ExternalActivityDTO,
  InternalActivityDTO,
} from "./application/dtos/ActivityDTO";

export { ActivityAddedEvent } from "./domain/events/ActivityAddedEvent";

export { AuthContextAdapter } from "./infrastructure/adapters/AuthContextAdapter";
