import { AdminRepository } from "../../../domain/ports/AdminRepository";
import { Administrator } from "../../../domain/model/Administrator";

export class InMemoryAdminRepository implements AdminRepository {
  private users: Administrator[] = [];

  async save(admin: Administrator): Promise<void> {
    console.log(`[DB] Salvataggio utente: ${admin.email} (ID: ${admin.id})`);
    this.users.push(admin);
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    console.log(`[DB] Ricerca utente per email: ${email}`);
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }
}
