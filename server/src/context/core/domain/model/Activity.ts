import { Period } from "../../../../shared/domain/Period";

export enum ActivityType {
  INTERNAL_ACTIVITY = "INTERNAL_ACTIVITY",
  EXTERNAL_ACTIVITY = "EXTERNAL_ACTIVITY",
}

export interface Activity {
  id?: string;
  roomId: string;
  campus: string;
  title: string;
  period: Period;
  type: ActivityType;
}

export interface InternalActivity extends Activity {
  type: ActivityType.INTERNAL_ACTIVITY;
  courseId?: string;
  professor: string[];
}

export interface ExternalActivity extends Activity {
  type: ActivityType.EXTERNAL_ACTIVITY;
  description?: string;
  authorId?: string;
}
