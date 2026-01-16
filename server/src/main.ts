import { env } from "./shared/config/env";
import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import { InMemoryEventBus } from "./shared/infrastructure/bus/InMemoryEventBus";

import {
  MongoAdminRepository,
  AuthService,
  AuthFacade,
  AuthController,
  createAuthRouter,
} from "./context/authentication";

import {
  CoreContextFactory,
  CoreController,
  CoreRoutes,
  AuthContextAdapter,
} from "./context/core";

const app = express();

app.use(express.json());

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("Connesso a MongoDB");

    const adminRepo = new MongoAdminRepository();
    const authService = new AuthService(adminRepo);
    const authFacade = new AuthFacade(authService);
    const authController = new AuthController(authService);
    const authRouter = createAuthRouter(authController);

    app.use("/api/auth", authRouter);

    const eventBus = new InMemoryEventBus();
    const mongoClient =
      mongoose.connection.getClient() as unknown as MongoClient;

    const authAdapter = new AuthContextAdapter(authFacade);
    const coreContext = CoreContextFactory.create(
      mongoClient,
      authAdapter,
      eventBus,
    );
    const coreController = new CoreController(coreContext);
    const coreRoutes = new CoreRoutes(coreController);

    app.use("/api/core", coreRoutes.getRouter());

    app.listen(env.PORT, () => {
      console.log(`
      Server avviato su http://localhost:${env.PORT}
      ------------------------------------------
      Status DB: CONNESSO 🟢
      Mode: ${env.NODE_ENV}
      Endpoints:
      - Auth: http://localhost:${env.PORT}/api/auth
      - Core: http://localhost:${env.PORT}/api/core
      ------------------------------------------
      `);
    });
  } catch (error) {
    console.error("Errore durante l'avvio:", error);
    process.exit(1);
  }
}

bootstrap();
