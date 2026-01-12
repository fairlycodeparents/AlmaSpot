import { env } from "./shared/config/env";
import express from "express";
import mongoose from "mongoose";
import { MongoAdminRepository } from "./context/authentication/infrastructure/persistence/mongo/MongoAdminRepository";
import { AuthService } from "./context/authentication/application/services/AuthService";
import { AuthController } from "./context/authentication/infrastructure/web/AuthController";
import { createAuthRouter } from "./context/authentication/infrastructure/web/AuthRoutes";

const app = express();

app.use(express.json());

async function bootstrap() {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("Connesso a MongoDB");

    const adminRepo = new MongoAdminRepository();
    const authService = new AuthService(adminRepo);
    const authController = new AuthController(authService);
    const authRouter = createAuthRouter(authController);

    app.use("/api/auth", authRouter);

    app.listen(env.PORT, () => {
      console.log(`
      Server avviato su http://localhost:${env.PORT}
      ------------------------------------------
      Status DB: CONNESSO 🟢
      Mode: ${env.NODE_ENV}
      ------------------------------------------
      `);
    });
  } catch (error) {
    console.error("Errore durante l'avvio:", error);
    process.exit(1);
  }
}

bootstrap();
