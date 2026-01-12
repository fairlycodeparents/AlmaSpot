import { Period } from "../../../../shared/domain/Period";
import { Plan } from "../../../../shared/domain/Plan";

export class Subscription {
  constructor(
    public readonly studentId: string,
    readonly plan: Plan,
  ) {}

  /**
   * Checks if the Subscription includes the specified Room and Period.
   * @param roomId the target room ID
   * @param period the time Period to check
   */
  isInterestedIn(roomId: string, period: Period): boolean {
    return this.plan.hasOverlapWith(roomId, period);
  }
}
