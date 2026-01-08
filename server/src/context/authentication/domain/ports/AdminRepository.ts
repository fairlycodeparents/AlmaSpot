import { Administrator } from "../model/Administrator";

export interface AdminRepository {
  save(admin: Administrator): Promise<void>;

  findByEmail(email: string): Promise<Administrator | null>;
}
