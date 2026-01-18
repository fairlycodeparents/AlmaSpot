import { env } from "./shared/config/env";
import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import { InMemoryEventBus } from "./shared/infrastructure/bus/InMemoryEventBus";
import {
  AuthenticationContextFactory,
  AuthController,
  AuthRoutes,
} from "./context/authentication";
import {
  ActivityAddedEvent,
  CoreContextFactory,
  CoreController,
  CoreRoutes,
  AuthContextAdapter,
} from "./context/core";
import {
  WebPushAdapter,
  MongoSubscriptionRepository,
  NotificationService,
  ActivityAddedListener,
  NotificationController,
} from "./context/notification";
import { SearchController, SearchRoutes } from "./context/search";
import { SearchContextFactory } from "./context/search/SearchContextFactory";

const app = express();

app.use(express.json());

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);
    const eventBus = new InMemoryEventBus();
    const mongoClient =
      mongoose.connection.getClient() as unknown as MongoClient;

    console.log("Connesso a MongoDB");

    const authContext = AuthenticationContextFactory.create();
    const authController = new AuthController(authContext.authPort);
    const authRoutes = new AuthRoutes(authController);

    const authAdapter = new AuthContextAdapter(authContext.facade);
    const coreContext = CoreContextFactory.create(
      mongoClient,
      authAdapter,
      eventBus,
    );
    const coreController = new CoreController(coreContext);
    const coreRoutes = new CoreRoutes(coreController);

    const notificationSender = new WebPushAdapter();
    const subscriptionRepo = new MongoSubscriptionRepository();
    const notificationService = new NotificationService(
      notificationSender,
      subscriptionRepo,
    );
    const sendNotificationListener = new ActivityAddedListener(
      notificationService,
    );
    const notificationController = new NotificationController(
      notificationService,
    );
    const notificationRouter = express.Router();
    eventBus.subscribe(
      ActivityAddedEvent.EVENT_NAME,
      sendNotificationListener.on.bind(sendNotificationListener),
    );
    notificationRouter.post("/subscribe", (req, res) =>
      notificationController.subscribe(req, res),
    );

    const searchService = SearchContextFactory.create(coreContext);
    const searchController = new SearchController(searchService);
    const searchRoutes = new SearchRoutes(searchController);

    app.use("/api/notifications", notificationRouter);
    app.use("/api/auth", authRoutes.getRouter());
    app.use("/api/core", coreRoutes.getRouter());
    app.use("/api/search", searchRoutes.getRouter());

    app.listen(env.PORT, () => {
      console.log(`
      Server avviato su http://localhost:${env.PORT}
      ------------------------------------------
      Status DB: CONNESSO
      Mode: ${env.NODE_ENV}
      Endpoints:
      - Auth: http://localhost:${env.PORT}/api/auth
      - Core: http://localhost:${env.PORT}/api/core
      - Notifications: http://localhost:${env.PORT}/api/notifications
      - Search: http://localhost:${env.PORT}/api/search
      ------------------------------------------
      `);
    });
  } catch (error) {
    console.error("Errore durante l'avvio:", error);
    process.exit(1);
  }
}

bootstrap();
