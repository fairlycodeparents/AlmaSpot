import type { AdminRepository } from "../../domain/ports/AdminRepository";

export class AuthService {
  constructor(private readonly repo: AdminRepository) {}

  async signUp(email: String, password: string): Promise<void> {
    void email;
    void password;
    this.repo;
    // TODO
  }

  async login(email: string, password: string): Promise<string> {
    void email;
    void password;
    this.repo;
    // TODO
    return "";
  }

  verifyToken(token: string): boolean {
    void token;
    // TODO
    return false;
  }
}
