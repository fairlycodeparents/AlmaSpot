import { Subscription } from "../model/Subscription";

export interface SubscriptionRepository {
  findAll(): Promise<Subscription[]>;
  delete(subId: any): Promise<void>;
  save(subscription: Subscription): any;
}
