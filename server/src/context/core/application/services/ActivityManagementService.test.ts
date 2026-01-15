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

  it("syncEvent: Non deve scaricare se sync fatto meno di 1 ora fa", async () => {
    const now = new Date();
    const recentSync = new Date(now.getTime() - 1000 * 60 * 30);

    mockRoomRepository.getLastSync.mock.mockImplementation(
      async () => recentSync,
    );
    await service.syncEvent(Campus.CESENA, new Date("2026-03-20"));

    assert.strictEqual(
      mockProvider.fetchInternalActivities.mock.calls.length,
      0,
    );
    assert.strictEqual(
      mockRoomRepository.updateInternalActivities.mock.calls.length,
      0,
    );
  });

  it("syncEvent: Deve scaricare, aggiornare DB e settare lastSync se sync mai fatto o vecchio", async () => {
    mockRoomRepository.getLastSync.mock.mockImplementation(async () => null);

    const fakeActivities = [{ title: "Lezione" }] as InternalActivity[];
    mockProvider.fetchInternalActivities.mock.mockImplementation(
      async () => fakeActivities,
    );
    await service.syncEvent(Campus.CESENA, new Date("2026-03-20"));

    assert.strictEqual(
      mockProvider.fetchInternalActivities.mock.calls.length,
      1,
    );
    assert.strictEqual(
      mockRoomRepository.updateInternalActivities.mock.calls.length,
      1,
    );
    assert.strictEqual(mockRoomRepository.setLastSync.mock.calls.length, 1);
  });

  it("syncEvent: Deve evitare chiamate doppie simultanee", async () => {
    mockRoomRepository.getLastSync.mock.mockImplementation(async () => null);
    mockProvider.fetchInternalActivities.mock.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 50));
      return [];
    });

    const p1 = service.syncEvent(Campus.CESENA, new Date("2026-03-20"));
    const p2 = service.syncEvent(Campus.CESENA, new Date("2026-03-20"));
    await Promise.all([p1, p2]);

    assert.strictEqual(
      mockProvider.fetchInternalActivities.mock.calls.length,
      1,
    );
  });

  it("createEvent: Errore Auth se token invalido", async () => {
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

  it("createEvent: Errore Conflict se sovrapposizione temporale", async () => {
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

  it("createEvent: Salva e Pubblica se tutto ok", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);
    mockRoomRepository.getEventsPerRoom.mock.mockImplementation(async () => []);

    const newEvent = {
      id: "123",
      roomId: "AULA A",
      campus: "Cesena",
      title: "Hackathon",
      description: "Coding",
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

  it("deleteEvent: Errore se attività non trovata", async () => {
    mockAuthService.validateAdminToken.mock.mockImplementation(() => true);
    mockRoomRepository.getActivityById.mock.mockImplementation(
      async () => null,
    );

    await assert.rejects(async () => {
      await service.deleteEvent("valid-token", "missing-id");
    }, "Error: Not Found: External activity does not exist.");
  });

  it("deleteEvent: Errore se si prova a cancellare attività INTERNAL", async () => {
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

  it("deleteEvent: Errore se attività è passata o in corso", async () => {
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

  it("deleteEvent: Cancella se EXTERNAL e nel futuro (non passata o in corso)", async () => {
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
