import { AuthService as CoreAuthPort } from "../../domain/ports/ServicePorts";
import { AuthFacade } from "../../../authentication";

export class AuthContextAdapter implements CoreAuthPort {
  constructor(private readonly authFacade: AuthFacade) {}

  validateAdminToken(token: string): boolean {
    return this.authFacade.isValidToken(token);
  }
}
