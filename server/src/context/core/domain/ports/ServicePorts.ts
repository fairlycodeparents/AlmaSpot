import { Campus } from "../../../../shared/domain/Location";
import { InternalActivity } from "../model/Activity";

export interface UniboProvider {
  fetchInternalActivities(
    campus: Campus,
    date: Date,
  ): Promise<InternalActivity[]>;
}

export interface AuthService {
  validateAdminToken(token: string): boolean;
}
