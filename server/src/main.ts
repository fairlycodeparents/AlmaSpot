import { env } from "./shared/config/env";
import express from "express";
import mongoose from "mongoose";
//import { MongoClient } from "mongodb";

import { InMemoryEventBus } from "./shared/infrastructure/bus/InMemoryEventBus";

import { MongoAdminRepository } from "./context/authentication/infrastructure/persistence/mongo/MongoAdminRepository";
import { AuthService } from "./context/authentication/application/services/AuthService";
import { AuthController } from "./context/authentication/infrastructure/web/AuthController";
import { createAuthRouter } from "./context/authentication/infrastructure/web/AuthRoutes";
import { WebPushAdapter } from "./context/notification/infrastructure/adapters/WebPushAdapter";
import { MongoSubscriptionRepository } from "./context/notification/infrastructure/persistence/mongo/MongoSubscriptionRepo";
import { NotificationService } from "./context/notification/application/NotificationService";
import { ActivityAddedListener } from "./context/notification/application/subscribers/ActivityAddedListener";
import { NotificationController } from "./context/notification/infrastructure/delivery/http/NotificationController";

import {
  ActivityAddedEvent,
  //CoreContextFactory,
  //CoreController,
  //CoreRoutes,
  //AuthContextAdapter,
} from "./context/core";

const app = express();

app.use(express.json());

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);
    const eventBus = new InMemoryEventBus();
    //const mongoClient = mongoose.connection.getClient() as unknown as MongoClient;

    console.log("Connesso a MongoDB");

    const adminRepo = new MongoAdminRepository();
    const authService = new AuthService(adminRepo);
    const authController = new AuthController(authService);
    const authRouter = createAuthRouter(authController);

    /*const authAdapter = new AuthContextAdapter(authFacade);
    const coreContext = CoreContextFactory.create(
        mongoClient,
        authAdapter,
        eventBus,
    );*/
    //const coreController = new CoreController(coreContext);
    //const coreRoutes = new CoreRoutes(coreController);

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

    app.use("/api/notifications", notificationRouter);
    app.use("/api/auth", authRouter);
    //app.use("/api/core", coreRoutes.getRouter());

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
      ------------------------------------------
      `);
    });
  } catch (error) {
    console.error("Errore durante l'avvio:", error);
    process.exit(1);
  }
}

bootstrap();
