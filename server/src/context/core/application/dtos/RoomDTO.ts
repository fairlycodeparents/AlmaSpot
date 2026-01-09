export enum RoomTypeDTO {
  CLASSROOM = "CLASSROOM",
  LABORATORY = "LABORATORY",
}

export interface RoomDTO {
  id: string;
  name: string;
  type: RoomTypeDTO;
  campus: string;
  site: {
    campus: string;
    address: string;
  };
}
