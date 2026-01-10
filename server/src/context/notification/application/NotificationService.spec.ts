import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { NotificationService } from "./NotificationService";

describe("NotificationService", () => {
  let service: NotificationService;
  let mockSender: any;
  let mockRepo: any;

  beforeEach(() => {
    mockSender = {
      send: mock.fn(async () => {}),
    };
    mockRepo = {
      findAll: mock.fn(async () => []),
      delete: mock.fn(async () => {}),
    };
    service = new NotificationService(mockSender, mockRepo);
  });

  it("It should send a Notification if the Student is interested in", async () => {
    const interestedSub = {
      studentId: "student-token",
      isInterestedIn: mock.fn(() => true),
    };
    mockRepo.findAll.mock.mockImplementation(async () => [interestedSub]);
    const event: any = {
      payload: {
        roomId: "Aula1",
        startTime: new Date("2026-01-01T10:00:00Z"),
        endTime: new Date("2026-01-01T12:00:00Z"),
        title: "Seminario",
      },
    };
    await service.handleActivityAdded(event);
    assert.strictEqual(interestedSub.isInterestedIn.mock.callCount(), 1);
    assert.strictEqual(mockSender.send.mock.callCount(), 1);
    assert.strictEqual(mockRepo.delete.mock.callCount(), 0);
    const notificationSent = mockSender.send.mock.calls[0].arguments[0];
    assert.strictEqual(notificationSent.studentId, "student-token");
    assert.strictEqual(
      notificationSent.message,
      "Una nuova attività 'Seminario' si sovrappone con il tuo piano",
    );
    assert.strictEqual(notificationSent.status, "SENT");
  });

  it("It should not send anything if the student is not interested in", async () => {
    const notInterestedSub = {
      studentId: "student-token2",
      isInterestedIn: mock.fn(() => false),
    };
    mockRepo.findAll.mock.mockImplementation(async () => [notInterestedSub]);
    const event: any = {
      payload: {
        roomId: "Aula2",
        title: "Recupero lezione C",
        startTime: new Date("2026-01-01T10:00:00Z"),
        endTime: new Date("2026-01-01T13:00:00Z"),
      },
    };
    await service.handleActivityAdded(event);
    assert.strictEqual(
      mockSender.send.mock.callCount(),
      0,
      "Sender shouldn't have been called",
    );
  });

  it("It should remove device from DB if receives DEVICE_GONE", async () => {
    const deadSub = {
      studentId: "dead-token",
      isInterestedIn: mock.fn(() => true),
    };
    mockRepo.findAll.mock.mockImplementation(async () => [deadSub]);
    mockSender.send.mock.mockImplementation(async () => {
      const error: any = new Error("DEVICE_GONE");
      error.statusCode = 410;
      throw error;
    });
    const event: any = {
      payload: {
        title: "Test",
        startTime: new Date("2026-01-01T10:00:00Z"),
        endTime: new Date("2026-01-01T11:00:00Z"),
      },
    };
    await service.handleActivityAdded(event);
    assert.strictEqual(mockSender.send.mock.callCount(), 1);
    assert.strictEqual(mockRepo.delete.mock.callCount(), 1);
    const deleteArgs = mockRepo.delete.mock.calls[0].arguments;
    assert.strictEqual(deleteArgs[0], "dead-token");
  });

  it("It should handle generic errors without deleting the device", async () => {
    const sub = {
      studentId: "network-error-token",
      isInterestedIn: mock.fn(() => true),
    };
    mockRepo.findAll.mock.mockImplementation(async () => [sub]);
    mockSender.send.mock.mockImplementation(async () => {
      throw new Error("Network Error 500");
    });
    const event: any = {
      payload: {
        title: "Test",
        startTime: new Date("2026-01-01T10:00:00Z"),
        endTime: new Date("2026-01-01T11:00:00Z"),
      },
    };
    await assert.doesNotReject(async () => {
      await service.handleActivityAdded(event);
    });
    assert.strictEqual(mockSender.send.mock.callCount(), 1);
    assert.strictEqual(mockRepo.delete.mock.callCount(), 0);
  });
});
