import { Campus } from "../../../../shared/domain/Location";
import { ExternalActivity, InternalActivity } from "../model/Activity";

export interface UniboProvider {
  fetchInternalActivities(
    campus: Campus,
    date: Date,
  ): Promise<InternalActivity[]>;
}

export interface NotificationService {
  sendEventNotification(event: ExternalActivity): Promise<void>;
}

export interface AuthService {
  validateAdminToken(token: string): boolean;
}
