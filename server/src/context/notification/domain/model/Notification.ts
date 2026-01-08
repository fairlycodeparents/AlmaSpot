export class Notification {
  constructor(
    public readonly studentId: string,
    public readonly message: string,
    public readonly timestamp: Date,
    public status: "PENDING" | "SENT",
  ) {}
}
