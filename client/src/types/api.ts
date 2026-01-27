export type RoomTypeDTO = "CLASSROOM" | "LABORATORY";

export interface PeriodDTO {
  start: string | Date;
  end: string | Date;
  date?: Date;
}

export interface SlotDTO {
  roomId: string;
  period: PeriodDTO;
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

export interface RoomAvailabilityDTO {
  room: RoomDTO;
  availableSlots?: SlotDTO[];
}

export interface ActivityDTO {
  id: string;
  roomId: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  campus: string;
}

export interface CreateActivityDTO {
  id?: string;
  roomId: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  campus: string;
  site: string;
  authorId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface SearchPayload {
  mode: "aggiungi" | "rimuovi";
  activity: string;
  campus: string;
  date: string;
  time: string;
  duration: number;
}
