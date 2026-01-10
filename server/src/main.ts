import { env } from "./shared/config/env";
import express from "express";
import { InMemoryAdminRepository } from "./context/authentication/infrastructure/repositories/InMemoryAdminRepository";
import { AuthService } from "./context/authentication/application/services/AuthService";
import { AuthController } from "./context/authentication/infrastructure/web/AuthController";
import { createAuthRouter } from "./context/authentication/infrastructure/web/AuthRoutes";

const app = express();

app.use(express.json());

const adminRepo = new InMemoryAdminRepository();
const authService = new AuthService(adminRepo);
const authController = new AuthController(authService);
const authRouter = createAuthRouter(authController);

app.use("/api/auth", authRouter);

app.listen(env.PORT, () => {
  console.log(`
    Server avviato su http://localhost:${env.PORT}
    ------------------------------------------
    Endpoint disponibili:
    POST /api/auth/signup
    POST /api/auth/login
    ------------------------------------------
    `);
});
