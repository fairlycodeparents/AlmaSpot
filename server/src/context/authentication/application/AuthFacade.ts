import { AuthService } from "./services/AuthService";

export class AuthFacade {
  constructor(private readonly authService: AuthService) {}

  public isValidToken(token: string): boolean {
    return this.authService.verifyToken(token);
  }
}
