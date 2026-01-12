import { AdminRepository } from "../../../domain/ports/AdminRepository";
import { Administrator } from "../../../domain/model/Administrator";
import { AdminModel } from "./MongoAdminSchema";
import { AdminMapper } from "./AdminMapper";

export class MongoAdminRepository implements AdminRepository {
  async save(admin: Administrator): Promise<void> {
    const rawData = AdminMapper.toPersistence(admin);

    await AdminModel.findByIdAndUpdate(admin.id, rawData, {
      upsert: true,
      new: true,
    });
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const found = await AdminModel.findOne({ email });

    if (!found) return null;

    return AdminMapper.toDomain(found);
  }
}
