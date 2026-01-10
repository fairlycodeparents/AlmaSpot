import { Slot } from "./Slot";
import { Period } from "./Period";

export class Plan {
  constructor(public readonly slots: Slot[]) {}

  /**
   * Checks if any existing Plan slot matches the specified room and period.
   * @param roomId the target room ID
   * @param period the time Period to check
   * @returns `true` if an overlap is found in the slots.
   */
  hasOverlapWith(roomId: string, period: Period): boolean {
    return this.slots.some((slot) => slot.matches(roomId, period));
  }
}
