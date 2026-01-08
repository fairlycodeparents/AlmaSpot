import { Plan } from "../../../../shared/domain/Plan";

export class Suggestion {
  constructor(
    public readonly plan: Plan,
    public readonly response: string,
  ) {}
}
