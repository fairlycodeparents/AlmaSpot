import { RoomDTO } from "./RoomDTO";
import { Slot } from "../../../../shared/domain/Slot";

export interface RoomAvailabilityDTO {
  room: RoomDTO;
  availableSlots: Slot[];
}
