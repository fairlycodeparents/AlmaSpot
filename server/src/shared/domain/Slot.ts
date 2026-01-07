import { Period } from "./Period";

export class Slot {
  constructor(
    public readonly roomId: string,
    public readonly period: Period,
  ) {}

  matches(eventRoomId: string, eventPeriod: Period): boolean {
    return this.roomId === eventRoomId && this.period.overlaps(eventPeriod);
  }
}
