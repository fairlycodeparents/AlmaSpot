import type {
  LoginDto,
  SignUpDto,
} from "../../../server/src/context/authentication/application/dtos/AuthDtos";
import type {
  ActivityDTO,
  CreateActivityDTO,
  RoomDTO,
  RoomTypeDTO,
} from "../../../server/src/context/core/";
import type { RoomAvailabilityDTO } from "../../../server/src/context/core/application/dtos/RoomAvailabilityDTO";

export type {
  RoomAvailabilityDTO,
  ActivityDTO,
  CreateActivityDTO,
  RoomDTO,
  RoomTypeDTO,
};
export type { LoginDto, SignUpDto };

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
