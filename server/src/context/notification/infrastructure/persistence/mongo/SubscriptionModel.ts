import mongoose, { Schema, Document } from "mongoose";

export interface SubscriptionDocument extends Document {
  studentId: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  plan: any;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>({
  studentId: { type: String, required: true, unique: true, index: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  plan: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const SubscriptionModel = mongoose.model<SubscriptionDocument>(
  "Subscription",
  SubscriptionSchema,
);
