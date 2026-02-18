import { env } from "./shared/config/env";
import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import { seedRooms } from "./scripts/SeedRooms";
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
  NotificationRoutes,
} from "./context/notification";
import * as SearchContext from "./context/search";

const app = express();
let isReady = false;

app.use(express.json());

app.get("/health", (_req, res) => {
  if (isReady) {
    res.status(200).send("OK");
  } else {
    res.status(503).send("Initializing...");
  }
});

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);
    const eventBus = new InMemoryEventBus();
    const mongoClient =
      mongoose.connection.getClient() as unknown as MongoClient;
    await seedRooms(mongoClient.db());
    isReady = true;

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
    const searchRoutes = SearchContext.create(coreContext);

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
    const notificationRoutes = new NotificationRoutes(notificationController);
    eventBus.subscribe(
      ActivityAddedEvent.EVENT_NAME,
      sendNotificationListener.on.bind(sendNotificationListener),
    );

    app.use("/api/notifications", notificationRoutes.getRouter());
    app.use("/api/auth", authRoutes.getRouter());
    app.use("/api/core", coreRoutes.getRouter());
    app.use("/api/search", searchRoutes.getRouter());

    app.listen(env.PORT, () => {
      console.log(`
      Server started on http://localhost:${env.PORT}
      ------------------------------------------
      Status DB: CONNECTED
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
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

bootstrap();
