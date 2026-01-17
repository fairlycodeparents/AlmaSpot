import { MongoAdminRepository } from "./infrastructure/persistence/mongo/MongoAdminRepository";
import { AuthService } from "./application/services/AuthService";
import { AuthFacade } from "./application/AuthFacade";
import { AuthInputPort } from "./application/ports/AuthInputPort";

export interface AuthContext {
  authPort: AuthInputPort;
  facade: AuthFacade;
}

export class AuthenticationContextFactory {
  static create(): AuthContext {
    const repository = new MongoAdminRepository();
    const service = new AuthService(repository);
    const facade = new AuthFacade(service);

    return {
      authPort: service,
      facade,
    };
  }
}
