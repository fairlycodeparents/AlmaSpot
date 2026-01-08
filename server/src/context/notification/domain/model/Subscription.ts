import { Period } from "../../../../shared/domain/Period";
import { Plan } from "../../../../shared/domain/Plan";

export class Subscription {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    private plan: Plan,
  ) {}

  isInterestedIn(roomId: string, period: Period): boolean {
    return this.plan.hasOverlapWith(roomId, period);
  }
}
