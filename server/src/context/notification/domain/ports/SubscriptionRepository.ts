import { Subscription } from "../model/Subscription";

export type DeliveryDetails = {
  type: "WEB_PUSH";
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export interface SubscriptionRepository {
  findAll(): Promise<
    { subscription: Subscription; details: DeliveryDetails }[]
  >;
  delete(subId: any): Promise<void>;
  save(subscription: Subscription, details: DeliveryDetails): Promise<void>;
}
