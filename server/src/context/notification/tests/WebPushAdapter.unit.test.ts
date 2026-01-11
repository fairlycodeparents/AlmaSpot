import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert";
import webpush from "web-push";
import { WebPushAdapter } from "../infrastructure/adapters/WebPushAdapter";

describe("WebPushAdapter", () => {
  const originalEnv = { ...process.env };
  const fakeNotification: any = { message: "Hello world!" };
  const fakeDetails: any = {
    type: "WEB_PUSH",
    endpoint: "https://fake.endpoint",
    keys: { p256dh: "key", auth: "secret" },
  };

  beforeEach(() => {
    process.env["VAPID_PUBLIC_KEY"] = "test_pub_key";
    process.env["VAPID_PRIVATE_KEY"] = "test_priv_key";
    process.env["VAPID_SUBJECT"] = "mailto:test@test.com";
    mock.method(webpush, "setVapidDetails", () => {});
    mock.method(webpush, "sendNotification", async () => Promise.resolve());
  });

  afterEach(() => {
    process.env = originalEnv;
    mock.restoreAll();
  });

  it("Should throw error if VAPID keys are missing", () => {
    delete process.env["VAPID_PUBLIC_KEY"];
    assert.throws(() => {
      new WebPushAdapter();
    }, /FATAL: VAPID keys are missing/);
  });

  it("Should configure VAPID keys on initialization", () => {
    new WebPushAdapter();
    const setVapidCall = (webpush.setVapidDetails as any).mock.callCount();
    assert.strictEqual(setVapidCall, 1);
  });

  it("Should throw error if delivery type is not WEB_PUSH", async () => {
    const adapter = new WebPushAdapter();
    const wrongDetails: any = { type: "EMAIL" };
    await assert.rejects(async () => {
      await adapter.send(fakeNotification, wrongDetails);
    }, /cannot handle delivery type: EMAIL/);
  });

  it("Should call webpush.sendNotification with correct payload", async () => {
    const adapter = new WebPushAdapter();
    await adapter.send(fakeNotification, fakeDetails);
    const callArgs = (webpush.sendNotification as any).mock.calls[0].arguments;
    const subscriptionArg = callArgs[0];
    const payloadArg = JSON.parse(callArgs[1]);
    assert.strictEqual(subscriptionArg.endpoint, "https://fake.endpoint");
    assert.strictEqual(payloadArg.body, "Hello world!");
    assert.strictEqual(payloadArg.title, "AlmaSpot");
  });

  it("Should re-throw error if webpush fails", async () => {
    (webpush.sendNotification as any).mock.mockImplementation(async () => {
      const err: any = new Error("Gone");
      err.statusCode = 410;
      throw err;
    });
    const adapter = new WebPushAdapter();
    await assert.rejects(
      async () => {
        await adapter.send(fakeNotification, fakeDetails);
      },
      { statusCode: 410 },
    );
  });
});
