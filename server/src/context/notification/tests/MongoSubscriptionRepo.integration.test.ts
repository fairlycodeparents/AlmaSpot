import "dotenv/config";
import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoSubscriptionRepository } from "../infrastructure/persistence/mongo/MongoSubscriptionRepo";
import { SubscriptionModel } from "../infrastructure/persistence/mongo/SubscriptionModel";
import { Subscription } from "../domain/model/Subscription";
import { DeliveryDetails } from "../domain/ports/SubscriptionRepository";
import { Plan } from "../../../shared/domain/Plan";
import { Period } from "../../../shared/domain/Period";
import { Slot } from "../../../shared/domain/Slot";

const TEST_MONGO_URI = process.env["MONGO_URI"];

describe("MongoSubscriptionRepository", { timeout: 10000 }, () => {
  before(async () => {
    mongoose.set("strictQuery", false);
    if (!TEST_MONGO_URI) {
      throw new Error("MONGO_URI is not defined!");
    }
    try {
      await mongoose.connect(TEST_MONGO_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log("Connected to test DB");
    } catch (err) {
      console.error("DB Connection Failed. Is Docker running?");
      throw err;
    }
  });

  beforeEach(async () => {
    await SubscriptionModel.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("Should save a subscription to MongoDB", async () => {
    const repo = new MongoSubscriptionRepository();
    const studentId = "student1";
    const slot1 = new Slot(
      "AulaMagna",
      new Period(
        new Date("2024-05-20T09:00:00.000Z"),
        new Date("2024-05-20T11:00:00.000Z"),
      ),
    );
    const slot2 = new Slot(
      "Lab1",
      new Period(
        new Date("2024-05-20T11:00:00.000Z"),
        new Date("2024-05-20T13:00:00.000Z"),
      ),
    );
    const plan = new Plan([slot1, slot2]);
    const subscription = new Subscription(studentId, plan);
    const details: DeliveryDetails = {
      type: "WEB_PUSH",
      endpoint: "https://fcm.googleapis.com/fcm/send/wd...",
      keys: { p256dh: "fake-key", auth: "fake-auth" },
    };
    await repo.save(subscription, details);
    const savedDoc = await SubscriptionModel.findOne({ studentId });
    assert.ok(savedDoc, "Document should exist in MongoDB");
    assert.strictEqual(savedDoc.studentId, studentId);
    assert.strictEqual(savedDoc.keys.p256dh, "fake-key");
    assert.ok(savedDoc.plan, "Plan should be saved");
  });

  it("Should find an existing subscription", async () => {
    const repo = new MongoSubscriptionRepository();
    const studentId = "student2";
    const planData = {
      slots: [
        {
          roomId: "Aula2",
          startTime: new Date("2024-03-10T09:00:00.000Z"),
          endTime: new Date("2024-03-10T11:00:00.000Z"),
        },
        {
          roomId: "Lab2",
          startTime: new Date("2024-03-10T14:30:00.000Z"),
          endTime: new Date("2024-03-10T16:30:00.000Z"),
        },
      ],
    };
    await SubscriptionModel.create({
      studentId,
      keys: { p256dh: "fake-key", auth: "fake-auth" },
      plan: planData,
      updatedAt: new Date(),
    });
    const results = await repo.findAll();
    const found = results.find((r) => r.subscription.studentId === studentId);
    assert.ok(found, "Should find the subscription we just created");
    assert.strictEqual(found?.details.keys.p256dh, "fake-key");
  });

  it("Should delete a subscription", async () => {
    const repo = new MongoSubscriptionRepository();
    const studentId = "student-to-delete";

    await SubscriptionModel.create({
      studentId,
      keys: { p256dh: "fake-key", auth: "fake-auth" },
      plan: [],
      updatedAt: new Date(),
    });
    await repo.delete(studentId);
    const found = await SubscriptionModel.findOne({ studentId });
    assert.strictEqual(found, null);
  });
});
