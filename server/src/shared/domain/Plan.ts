import { Slot } from "./Slot";
import { Period } from "./Period";

export class Plan {
  constructor(public readonly slots: Slot[]) {}

  hasOverlapWith(roomId: string, period: Period): boolean {
    return this.slots.some((slot) => slot.matches(roomId, period));
  }
}
