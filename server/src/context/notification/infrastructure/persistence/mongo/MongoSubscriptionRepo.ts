import {
  SubscriptionRepository,
  DeliveryDetails,
} from "../../../domain/ports/SubscriptionRepository";
import { Subscription } from "../../../domain/model/Subscription";
import { SubscriptionModel } from "./SubscriptionModel";
import { Plan } from "../../../../../shared/domain/Plan";

export class MongoSubscriptionRepository implements SubscriptionRepository {
  async save(
    subscription: Subscription,
    details: DeliveryDetails,
  ): Promise<void> {
    if (details.type !== "WEB_PUSH") {
      throw new Error(
        `MongoRepository cannot save delivery type: ${details.type}`,
      );
    }
    const mongoPlan = {
      slots: subscription.plan.slots.map((slot) => ({
        roomId: slot.roomId,
        startTime: slot.period.start,
        endTime: slot.period.end,
      })),
    };
    await SubscriptionModel.updateOne(
      { studentId: subscription.studentId },
      {
        studentId: subscription.studentId,
        keys: details.keys,
        plan: mongoPlan,
        updatedAt: new Date(),
      },
      { upsert: true },
    );
  }

  async findAll(): Promise<
    { subscription: Subscription; details: DeliveryDetails }[]
  > {
    const docs = await SubscriptionModel.find().lean();
    return docs.map((doc: any) => {
      const slotsPrimitive = doc.plan && doc.plan.slots ? doc.plan.slots : [];
      const plan = Plan.fromPrimitives(slotsPrimitive);
      const sub = new Subscription(doc.studentId, plan);
      const details: DeliveryDetails = {
        type: "WEB_PUSH",
        endpoint: doc.studentId,
        keys: doc.keys,
      };
      return { subscription: sub, details };
    });
  }

  async delete(studentId: string): Promise<void> {
    await SubscriptionModel.deleteOne({ studentId });
  }
}
