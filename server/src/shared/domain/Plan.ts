import { Slot } from "./Slot";
import { Period } from "./Period";

export type SlotPrimitive = {
  roomId: string;
  startTime: string;
  endTime: string;
};

export class Plan {
  constructor(public readonly slots: Slot[]) {}

  /**
   * Creates a Plan object from raw data
   * @param primitives the raw data to traslate
   */
  static fromPrimitives(primitives: SlotPrimitive[]): Plan {
    if (!Array.isArray(primitives)) {
      throw new Error("Invalid Plan: Input must be an array of slots");
    }
    const slots = primitives.map((item) => {
      if (!item.roomId || !item.startTime || !item.endTime) {
        throw new Error("Invalid Slot: Missing roomId, startTime, or endTime");
      }
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error(`Invalid Date format for room ${item.roomId}`);
      }
      const period = new Period(start, end);
      return new Slot(item.roomId, period);
    });
    return new Plan(slots);
  }

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
