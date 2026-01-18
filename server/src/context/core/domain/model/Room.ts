import { Campus, Site } from "../../../../shared/domain/Location";

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
}
