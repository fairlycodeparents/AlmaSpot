import { Subscription } from "../model/Subscription";
import { Period } from "../../../../shared/domain/Period";

export type DeliveryDetails = {
  type: "WEB_PUSH";
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export interface SubscriptionRepository {
  findAll(): Promise<
    { subscription: Subscription; details: DeliveryDetails }[]
  >;
  delete(subId: string): Promise<void>;
  save(subscription: Subscription, details: DeliveryDetails): Promise<void>;
  findByRoomAndPeriod(
    roomId: string,
    eventPeriod: Period,
  ): Promise<{ subscription: Subscription; details: DeliveryDetails }[]>;
}
