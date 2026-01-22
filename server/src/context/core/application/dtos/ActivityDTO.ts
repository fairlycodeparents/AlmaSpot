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
  authorId?: string;
}

export interface CreateActivityDTO extends BaseActivityDTO {
  campus: string;
  site: string;
  authorId?: string;
}

export type ActivityDTO = InternalActivityDTO | ExternalActivityDTO;
