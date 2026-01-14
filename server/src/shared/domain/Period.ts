export class Period {
  public date: Date;

  constructor(
    public start: Date,
    public end: Date,
    date?: Date,
  ) {
    if (this.start >= this.end) {
      throw new Error("Invalid Period: start time must be before end time.");
    }

    if (date) {
      this.date = date;
    } else {
      this.date = new Date(start);
      this.date.setHours(0, 0, 0, 0);
    }
  }

  overlaps(other: Period): boolean {
    return this.start < other.end && this.end > other.start;
  }
}
