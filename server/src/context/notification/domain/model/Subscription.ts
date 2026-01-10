import { Period } from "../../../../shared/domain/Period";
import { Plan } from "../../../../shared/domain/Plan";

export type PushKeys = {
  p256dh: string;
  auth: string;
};

export class Subscription {
  constructor(
    public readonly studentId: string,
    private readonly plan: Plan,
    public readonly keys: PushKeys,
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
