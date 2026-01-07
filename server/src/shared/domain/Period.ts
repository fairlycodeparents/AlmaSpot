export class Period {
  constructor(
    public start: Date,
    public end: Date,
    public date: Date,
  ) {
    if (this.start >= this.end) {
      throw new Error("Invalid Period: start time must be before end time.");
    }
  }

  overlaps(other: Period): boolean {
    const sameDay = this.date.toDateString() === other.date.toDateString();
    if (!sameDay) return false;

    return this.start < other.end && this.end > other.start;
  }
}
