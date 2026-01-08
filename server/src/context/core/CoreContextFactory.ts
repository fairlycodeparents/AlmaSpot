import { CoreFacade } from "./application/CoreFacade";
import { RoomSearchService } from "./application/services/RoomSearchService";
import { ActivityManagementService } from "./application/services/ActivityManagementService";

export class CoreContextFactory {
  static create(): CoreFacade {
    //poi adapter reali quando li implementiamo
    const roomRepository = null as any;
    const uniboProvider = null as any;
    const notificationService = null as any;
    const authService = null as any;
    const eventBus = null as any;

    const activityManagementService = new ActivityManagementService(
      roomRepository,
      uniboProvider,
      notificationService,
      authService,
      eventBus,
    );
    const roomSearchService = new RoomSearchService(
      roomRepository,
      activityManagementService,
    );

    return new CoreFacade(roomSearchService, activityManagementService);
  }
}
