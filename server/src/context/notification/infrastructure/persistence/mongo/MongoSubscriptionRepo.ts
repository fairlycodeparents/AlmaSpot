import {
  SubscriptionRepository,
  DeliveryDetails,
} from "../../../domain/ports/SubscriptionRepository";
import { Subscription } from "../../../domain/model/Subscription";
import { SubscriptionModel } from "./SubscriptionModel";
import { Plan } from "../../../../../shared/domain/Plan";
import { Period } from "../../../../../shared/domain/Period";

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

  async findByRoomAndPeriod(
    roomId: string,
    period: Period,
  ): Promise<{ subscription: Subscription; details: DeliveryDetails }[]> {
    const docs = await SubscriptionModel.find({
      "plan.slots": {
        $elemMatch: {
          roomId: roomId,
          startTime: { $lte: period.start },
          endTime: { $gt: period.start },
        },
      },
    }).lean();
    return docs.map((doc: any) => {
      const slotsPrimitive = doc.plan && doc.plan.slots ? doc.plan.slots : [];
      return {
        subscription: new Subscription(
          doc.studentId,
          Plan.fromPrimitives(slotsPrimitive),
        ),
        details: {
          type: "WEB_PUSH",
          endpoint: doc.studentId,
          keys: doc.keys,
        },
      };
    });
  }

  async delete(studentId: string): Promise<void> {
    await SubscriptionModel.deleteOne({ studentId });
  }
}
