export enum ActivityTypeDTO {
  INTERNAL_ACTIVITY = "INTERNAL_ACTIVITY",
  EXTERNAL_ACTIVITY = "EXTERNAL_ACTIVITY",
}

export interface BaseActivityDTO {
  id: string;
  roomId: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface InternalActivityDTO extends BaseActivityDTO {
  type: ActivityTypeDTO.INTERNAL_ACTIVITY;
  courseId?: string;
  professors?: string[];
}

export interface ExternalActivityDTO extends BaseActivityDTO {
  type: ActivityTypeDTO.EXTERNAL_ACTIVITY;
  description?: string;
  authorId?: string;
}

export type ActivityDTO = InternalActivityDTO | ExternalActivityDTO;

export interface CreateActivityDTO {
  roomId: string;
  title: string;
  campus: string;
  site: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  authorId?: string;
}
