import mongoose, { Schema, Document } from "mongoose";

export interface SubscriptionDocument extends Document {
  studentId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  plan: {
    slots: Array<{
      roomId: string;
      startTime: Date;
      endTime: Date;
    }>;
  };
  updatedAt: Date;
}

const SlotSchema = new Schema(
  {
    roomId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { _id: false },
);

const SubscriptionSchema = new Schema<SubscriptionDocument>({
  studentId: { type: String, required: true, unique: true, index: true },
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  plan: {
    slots: {
      type: [SlotSchema],
      default: [],
    },
  },

  updatedAt: { type: Date, default: Date.now },
});

SubscriptionSchema.index({ "plan.slots.roomId": 1, "plan.slots.startTime": 1 });

export const SubscriptionModel = mongoose.model<SubscriptionDocument>(
  "Subscription",
  SubscriptionSchema,
);
