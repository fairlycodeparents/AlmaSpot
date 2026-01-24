import { AdminRepository } from "../../../domain/ports/AdminRepository";
import { Administrator } from "../../../domain/model/Administrator";

export class InMemoryAdminRepository implements AdminRepository {
  private users: Administrator[] = [];

  async save(admin: Administrator): Promise<void> {
    this.users.push(admin);
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }
}
