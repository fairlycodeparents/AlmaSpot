import { beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert";
import { ActivityManagementService } from "./ActivityManagementService";
import { MongoRoomRepository } from "../../infrastructure/persistence/mongo/MongoRoomRepository";
import { UniboProviderHTTP } from "../../infrastructure/adapters/UniboProviderHTTP";
import { EventBus } from "../../../../shared/domain/EventBus";
import { AuthService } from "../../domain/ports/ServicePorts";
import {
  ActivityType,
  ExternalActivity,
  InternalActivity,
} from "../../domain/model/Activity";
import { Period } from "../../../../shared/domain/Period";
import { Campus } from "../../../../shared/domain/Location";

describe("ActivityManagementService Test", () => {
  const mockRoomRepository = {
    getLastSync: mock.fn(async () => null as Date | null),
    setLastSync: mock.fn(async () => {}),
    getEventsPerRoom: mock.fn(async () => [] as InternalActivity[]),
    updateInternalActivities: mock.fn(async () => {}),
    saveExternalActivity: mock.fn(async () => {}),
    getActivityById: mock.fn(async () => null as any),
    deleteExternalActivity: mock.fn(async (_event: any) => {}),
  };

  const mockProvider = {
    fetchInternalActivities: mock.fn(async () => [] as InternalActivity[]),
  };

  const mockEventBus = {
    publish: mock.fn(async (_event: any) => {}),
  };

  const mockAuthService = {
    validateAdminToken: mock.fn(() => true),
  };

  let service: ActivityManagementService;
  const date = (h: number) =>
    new Date(`2026-03-20T${h.toString().padStart(2, "0")}:00:00`);

  beforeEach(() => {
    Object.values(mockRoomRepository).forEach((m) => m.mock.resetCalls());
    Object.values(mockProvider).forEach((m) => m.mock.resetCalls());
    Object.values(mockEventBus).forEach((m) => m.mock.resetCalls());
    Object.values(mockAuthService).forEach((m) => m.mock.resetCalls());

    service = new ActivityManagementService(
      mockRoomRepository as unknown as MongoRoomRepository,
      mockProvider as unknown as UniboProviderHTTP,
      mockAuthService as unknown as AuthService,
      mockEventBus as unknown as EventBus,
    );
  });

  it("syncEvent: shouldn't download new data if 'FRESH' (< 45 min)", async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    (mockRoomRepository.getLastSync as any).mock.mockImplementation(
      async () => tenMinutesAgo,
    );

    await service.syncEvent(Campus.CESENA, new Date());

    assert.strictEqual(
      (mockProvider.fetchInternalActivities as any).mock.calls.length,
      0,
    );
    assert.strictEqual(
      (mockRoomRepository.updateInternalActivities as any).mock.calls.length,
      0,
    );
  });

  it("syncEvent: should download new data in background if 'STALE' (ex. 1 hour ago)", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    (mockRoomRepository.getLastSync as any).mock.mockImplementation(
      async () => oneHourAgo,
    );

    await service.syncEvent(Campus.CESENA, new Date());

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.strictEqual(
      (mockProvider.fetchInternalActivities as any).mock.calls.length,
      1,
    );
    assert.strictEqual(
      (mockRoomRepository.updateInternalActivities as any).mock.calls.length,
      1,
    );
    assert.strictEqual(
      (mockRoomRepository.setLastSync as any).mock.calls.length,
      1,
    );
  });

  it("syncEvent: should download new data and wait for it if 'EXPIRED' (> 24h or null)", async () => {
    (mockRoomRepository.getLastSync as any).mock.mockImplementation(
      async () => null,
    );

    await service.syncEvent(Campus.CESENA, new Date());

    assert.strictEqual(
      (mockProvider.fetchInternalActivities as any).mock.calls.length,
      1,
    );
    assert.strictEqual(
      (mockRoomRepository.updateInternalActivities as any).mock.calls.length,
      1,
    );
  });

  it("syncEvent: shoudln't run more concurrent fetches", async () => {
    (mockRoomRepository.getLastSync as any).mock.mockImplementation(
      async () => null,
    );

    await Promise.all([
      service.syncEvent(Campus.CESENA, new Date()),
      service.syncEvent(Campus.CESENA, new Date()),
    ]);

    assert.strictEqual(
      (mockProvider.fetchInternalActivities as any).mock.calls.length,
      1,
    );
  });

  it("createEvent: authentication error if token isn't valid", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => false);
    const event = { roomId: "AULA A" } as ExternalActivity;

    await assert.rejects(async () => {
      await service.createEvent("bad-token", event);
    }, /Unauthorized/);

    assert.strictEqual(
      mockRoomRepository.saveExternalActivity.mock.calls.length,
      0,
    );
  });

  it("createEvent: conflict error if overlaps", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);

    const conflictPeriod = new Period(date(9), date(11));
    const existingEvent = { period: conflictPeriod } as InternalActivity;
    mockRoomRepository.getEventsPerRoom.mock.mockImplementation(async () => [
      existingEvent,
    ]);

    const newEvent = {
      roomId: "AULA A",
      period: new Period(date(10), date(12)),
    } as ExternalActivity;

    await assert.rejects(async () => {
      await service.createEvent("valid-token", newEvent);
    }, /Conflict detected/);

    assert.strictEqual(
      mockRoomRepository.saveExternalActivity.mock.calls.length,
      0,
    );
  });

  it("createEvent: save and publish if everything ok", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);
    mockRoomRepository.getEventsPerRoom.mock.mockImplementation(async () => []);

    const newEvent = {
      id: "123",
      roomId: "AULA A",
      campus: "Cesena",
      title: "Hackathon",
      period: new Period(date(14), date(18)),
    } as ExternalActivity;

    await service.createEvent("valid-token", newEvent);

    assert.strictEqual(
      mockRoomRepository.saveExternalActivity.mock.calls.length,
      1,
    );
    assert.strictEqual(mockEventBus.publish.mock.calls.length, 1);

    const firstCall = mockEventBus.publish.mock.calls[0];
    assert.ok(firstCall, "Publish should have been called, but wasn't");
    const publishedEvent = firstCall.arguments[0];
    assert.ok(
      publishedEvent,
      "Published event should not be null or undefined",
    );
  });

  it("deleteEvent: error if activity doesn't exist", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);
    mockRoomRepository.getActivityById.mock.mockImplementation(
      async () => null,
    );

    await assert.rejects(async () => {
      await service.deleteEvent("valid-token", "missing-id");
    }, "Error: Not Found: External activity does not exist.");
  });

  it("deleteEvent: error if deleting internal activities", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);

    const internalActivity = {
      id: "int-1",
      type: ActivityType.INTERNAL_ACTIVITY,
      period: { start: new Date("2030-01-01") },
    };
    mockRoomRepository.getActivityById.mock.mockImplementation(
      async () => internalActivity,
    );

    await assert.rejects(async () => {
      await service.deleteEvent("valid-token", "int-1");
    }, "Error: Bad Request: Cannot delete internal activities.");

    assert.strictEqual(
      mockRoomRepository.deleteExternalActivity.mock.calls.length,
      0,
    );
  });

  it("deleteEvent: error if activities in the past or currently ongoing", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const pastActivity = {
      id: "ext-old",
      type: "EXTERNAL",
      period: { start: pastDate },
    };
    mockRoomRepository.getActivityById.mock.mockImplementation(
      async () => pastActivity,
    );

    await assert.rejects(async () => {
      await service.deleteEvent("valid-token", "ext-old");
    }, "Error: Bad Request: Cannot delete past or ongoing activities.");

    assert.strictEqual(
      mockRoomRepository.deleteExternalActivity.mock.calls.length,
      0,
    );
  });

  it("deleteEvent: delete successfully if external and in the future", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const validActivity = {
      id: "ext-future",
      type: "EXTERNAL_ACTIVITY",
      period: { start: futureDate },
    };
    mockRoomRepository.getActivityById.mock.mockImplementation(
      async () => validActivity,
    );

    await service.deleteEvent("valid-token", "ext-future");
    assert.strictEqual(
      mockRoomRepository.deleteExternalActivity.mock.calls.length,
      1,
    );
  });
});
