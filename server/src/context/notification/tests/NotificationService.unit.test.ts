import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { NotificationService } from "../application/NotificationService";

describe("NotificationService", () => {
  let service: NotificationService;
  let mockSender: any;
  let mockRepo: any;
  let mockDetails: any;

  beforeEach(() => {
    mockSender = {
      send: mock.fn(async () => {}),
    };
    mockRepo = {
      findByRoomAndPeriod: mock.fn(async () => []),
      delete: mock.fn(async () => {}),
      save: mock.fn(async () => {}),
    };
    mockDetails = {
      type: "WEB_PUSH",
      endpoint: "https://fcm.googleapis.com/test-endpoint",
      keys: { p256dh: "key", auth: "secret" },
    };
    service = new NotificationService(mockSender, mockRepo);
  });

  it("It should send a Notification if the Student has a conflicting slot", async () => {
    const interestedSub = {
      studentId: "student1",
      plan: {
        slots: [
          {
            roomId: "Aula1",
            period: {
              start: new Date("2026-01-01T09:00:00Z"),
              end: new Date("2026-01-01T13:00:00Z"),
            },
          },
        ],
      },
    };
    mockRepo.findByRoomAndPeriod.mock.mockImplementation(async () => [
      { subscription: interestedSub, details: mockDetails },
    ]);

    const event: any = {
      payload: {
        roomId: "Aula1",
        startTime: new Date("2026-01-01T10:00:00Z"),
        endTime: new Date("2026-01-01T12:00:00Z"),
        title: "Seminario",
      },
    };
    await service.handleActivityAdded(event);
    assert.strictEqual(mockSender.send.mock.callCount(), 1);
    assert.strictEqual(mockRepo.delete.mock.callCount(), 0);
    const callArgs = mockSender.send.mock.calls[0].arguments;
    const notificationSent = callArgs[0];
    const detailsSent = callArgs[1];
    assert.strictEqual(notificationSent.studentId, "student1");
    assert.ok(notificationSent.message.includes("Seminario"));
    assert.ok(notificationSent.message.includes("si sovrappone"));
    assert.deepStrictEqual(
      detailsSent,
      mockDetails,
      "Should pass delivery details to sender",
    );
  });

  it("It should not send anything if no matching slot is found", async () => {
    const subNoConflict = {
      studentId: "student2",
      plan: {
        slots: [
          {
            roomId: "Aula2",
            period: {
              start: new Date("2026-01-01T08:00:00Z"),
              end: new Date("2026-01-01T09:00:00Z"),
            },
          },
        ],
      },
    };
    mockRepo.findByRoomAndPeriod.mock.mockImplementation(async () => [
      { subscription: subNoConflict, details: mockDetails },
    ]);
    const event: any = {
      payload: {
        roomId: "Aula2",
        title: "Recupero lezione",
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
      plan: {
        slots: [
          {
            roomId: "Aula3",
            period: {
              start: new Date("2026-01-01T09:00:00Z"),
              end: new Date("2026-01-01T13:00:00Z"),
            },
          },
        ],
      },
    };
    mockRepo.findByRoomAndPeriod.mock.mockImplementation(async () => [
      { subscription: deadSub, details: mockDetails },
    ]);
    mockSender.send.mock.mockImplementation(async () => {
      const error: any = new Error("DEVICE_GONE");
      error.statusCode = 410;
      throw error;
    });
    const event: any = {
      payload: {
        roomId: "Aula3",
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
      plan: {
        slots: [
          {
            roomId: "Aula4",
            period: {
              start: new Date("2026-01-01T09:00:00Z"),
              end: new Date("2026-01-01T13:00:00Z"),
            },
          },
        ],
      },
    };
    mockRepo.findByRoomAndPeriod.mock.mockImplementation(async () => [
      { subscription: sub, details: mockDetails },
    ]);
    mockSender.send.mock.mockImplementation(async () => {
      throw new Error("Network Error 500");
    });
    const event: any = {
      payload: {
        title: "Test",
        roomId: "Aula4",
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

  it("It should correctly unsubscribe a student by calling delete on repository", async () => {
    const studentIdToRemove = "student-to-remove";
    await service.unsubscribe(studentIdToRemove);
    assert.strictEqual(
      mockRepo.delete.mock.callCount(),
      1,
      "Repository delete should be called once",
    );
    const deleteArgs = mockRepo.delete.mock.calls[0].arguments;
    assert.strictEqual(
      deleteArgs[0],
      studentIdToRemove,
      "Should pass the correct studentId to the repository",
    );
  });
});
