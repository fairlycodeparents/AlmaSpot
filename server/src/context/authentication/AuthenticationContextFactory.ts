import { Router } from "express";
import { MongoAdminRepository } from "./infrastructure/persistence/mongo/MongoAdminRepository";
import { AuthService } from "./application/services/AuthService";
import { AuthController } from "./infrastructure/web/AuthController";
import { createAuthRouter } from "./infrastructure/web/AuthRoutes";
import { AuthFacade } from "./application/AuthFacade";

export interface AuthContext {
  facade: AuthFacade;
  router: Router;
}

export class AuthenticationContextFactory {
  static create(): AuthContext {
    const repository = new MongoAdminRepository();
    const service = new AuthService(repository);
    const facade = new AuthFacade(service);
    const controller = new AuthController(service);
    const router = createAuthRouter(controller);

    return {
      facade,
      router,
    };
  }
}
