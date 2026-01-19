import { RoomSearchService } from "./application/services/RoomSearchService";
import { ActivityManagementService } from "./application/services/ActivityManagementService";
import { MongoClient } from "mongodb";
import { EventBus } from "../../shared/domain/EventBus";
import { MongoRoomRepository } from "./infrastructure/persistence/mongo/MongoRoomRepository";
import { UniboProviderHTTP } from "./infrastructure/adapters/UniboProviderHTTP";
import { CoreFacade } from "./application/CoreFacade";
import { AuthContextAdapter } from "./infrastructure/adapters/AuthContextAdapter";

export class CoreContextFactory {
  static create(
    mongoClient: MongoClient,
    authService: AuthContextAdapter,
    eventBus: EventBus,
  ): CoreFacade {
    const dbName = process.env["MONGO_DB_NAME"] || "almaspot";
    const roomRepository = new MongoRoomRepository(mongoClient, dbName);
    const uniboProvider = new UniboProviderHTTP();

    const activityManagementService = new ActivityManagementService(
      roomRepository,
      uniboProvider,
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
