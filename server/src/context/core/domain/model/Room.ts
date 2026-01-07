import { Period } from "../../../../shared/domain/Period";
import { Campus, Site } from "../../../../shared/domain/Location";
import { Activity } from "./Activity";

export enum RoomType {
  CLASSROOM = "CLASSROOM",
  LABORATORY = "LABORATORY",
}

export class Room {
  constructor(
    public id: string,
    public name: string,
    public type: RoomType,
    public campus: Campus,
    public site: Site,
  ) {}

  isFreeInPeriod(period: Period, activities: Activity[]): boolean {
    const conflict = activities.some((activity) =>
      activity.period.overlaps(period),
    );
    return !conflict;
  }
}
