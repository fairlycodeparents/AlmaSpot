import { Administrator } from "../../../domain/model/Administrator";
import { AdminDocument } from "./MongoAdminSchema";

export class AdminMapper {
  static toDomain(raw: AdminDocument): Administrator {
    return new Administrator(raw.email, raw.hashedPassword, raw._id);
  }

  static toPersistence(admin: Administrator): any {
    return {
      email: admin.email,
      hashedPassword: admin.hashedPassword,
      _id: admin.id,
    };
  }
}
