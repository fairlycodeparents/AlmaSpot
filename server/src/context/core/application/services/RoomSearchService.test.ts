import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { RoomSearchService } from "./RoomSearchService";
import { MongoRoomRepository } from "../../infrastructure/persistence/mongo/MongoRoomRepository";
import { ActivityManagementService } from "./ActivityManagementService";
import { Period } from "../../../../shared/domain/Period";
import { Room, RoomType } from "../../domain/model/Room";
import { Activity } from "../../domain/model/Activity";
import { Campus, Site } from "../../../../shared/domain/Location";

describe("RoomSearchService Test", () => {
  const mockRoomRepository = {
    getRoomsByCampus: mock.fn(async () => [] as Room[]),
    getActivitiesByCampusAndDate: mock.fn(async () => [] as Activity[]),
  };

  const mockActivityService = {
    syncEvent: mock.fn(async () => {}),
  };

  let service: RoomSearchService;

  const d = (h: number) =>
    new Date(`2026-03-20T${h.toString().padStart(2, "0")}:00:00`);

  const makeRoom = (id: string, site: Site) =>
    new Room(id, id, RoomType.CLASSROOM, site.campus, site);

  const makeActivity = (roomId: string, startH: number, endH: number) =>
    ({
      id: `act-${startH}`,
      roomId,
      period: new Period(d(startH), d(endH)),
    }) as unknown as Activity;

  beforeEach(() => {
    Object.values(mockRoomRepository).forEach((m) => m.mock.resetCalls());
    Object.values(mockActivityService).forEach((m) => m.mock.resetCalls());

    service = new RoomSearchService(
      mockRoomRepository as unknown as MongoRoomRepository,
      mockActivityService as unknown as ActivityManagementService,
    );
  });

  it("findSlotsByCampus: Deve chiamare syncEvent prima di cercare", async () => {
    const period = new Period(d(9), d(13));
    mockRoomRepository.getRoomsByCampus.mock.mockImplementation(async () => []);
    mockRoomRepository.getActivitiesByCampusAndDate.mock.mockImplementation(
      async () => [],
    );

    await service.findSlotsByCampus(Campus.CESENA, period);

    assert.strictEqual(mockActivityService.syncEvent.mock.calls.length, 1);
  });

  it("findSlotsByCampus: Con aula libera restituisce intero slot", async () => {
    const cesenaSite = new Site(Campus.CESENA, "Via Università");
    const room = makeRoom("AULA-1", cesenaSite);

    mockRoomRepository.getRoomsByCampus.mock.mockImplementation(async () => [
      room,
    ]);
    mockRoomRepository.getActivitiesByCampusAndDate.mock.mockImplementation(
      async () => [],
    );

    const searchPeriod = new Period(d(9), d(11));

    const result = await service.findSlotsByCampus(Campus.CESENA, searchPeriod);

    assert.strictEqual(result.length, 1);
    assert.ok(result[0], "Expected at least one room result");
    assert.strictEqual(result[0].room.id, "AULA-1");
    assert.strictEqual(result[0].availableSlots.length, 1);

    const slot = result[0].availableSlots[0];
    assert.ok(slot, "Expected at least one slot");
    assert.strictEqual(slot.period.start.getTime(), d(9).getTime());
    assert.strictEqual(slot.period.end.getTime(), d(11).getTime());
  });

  it(
    "findSlotsByCampus: Con aula occupata parzialmente, restituisce più slot liberi " +
      "senza il periodo occupato",
    async () => {
      const cesenaSite = new Site(Campus.CESENA, "Via Università");
      const room = makeRoom("AULA-1", cesenaSite);

      const activity = makeActivity("AULA-1", 10, 11);

      mockRoomRepository.getRoomsByCampus.mock.mockImplementation(async () => [
        room,
      ]);
      mockRoomRepository.getActivitiesByCampusAndDate.mock.mockImplementation(
        async () => [activity],
      );

      const searchPeriod = new Period(d(9), d(12));

      const result = await service.findSlotsByCampus(
        Campus.CESENA,
        searchPeriod,
      );

      assert.strictEqual(result.length, 1);
      assert.ok(result[0], "Expected result to be defined");

      const slots = result[0].availableSlots;
      assert.strictEqual(slots.length, 2);
      assert.ok(slots[0], "Expected first slot to be defined");
      assert.strictEqual(slots[0].period.start.getTime(), d(9).getTime());
      assert.strictEqual(slots[0].period.end.getTime(), d(10).getTime());
      assert.ok(slots[1], "Expected second slot to be defined");
      assert.strictEqual(slots[1].period.start.getTime(), d(11).getTime());
      assert.strictEqual(slots[1].period.end.getTime(), d(12).getTime());
    },
  );

  it("findSlotsBySite: Deve filtrare le aule per l'indirizzo del Site specifico", async () => {
    const targetSite = new Site(Campus.CESENA, "Via Dell'Università 50");
    const otherSite = new Site(Campus.CESENA, "Villa Almerici");

    const roomRight = makeRoom("ROOM-RIGHT", targetSite);
    const roomWrong = makeRoom("ROOM-WRONG", otherSite);

    mockRoomRepository.getRoomsByCampus.mock.mockImplementation(async () => [
      roomRight,
      roomWrong,
    ]);
    mockRoomRepository.getActivitiesByCampusAndDate.mock.mockImplementation(
      async () => [],
    );

    const searchPeriod = new Period(d(9), d(10));

    const result = await service.findSlotsBySite(targetSite, searchPeriod);

    assert.strictEqual(result.length, 1);
    assert.ok(result[0], "Expected one room in result");
    assert.strictEqual(result[0].room.id, "ROOM-RIGHT");
  });

  it("getActivitiesInDateAndCampus: Chiama sync e fetch", async () => {
    const expectedActivities = [makeActivity("A1", 9, 10)];
    mockRoomRepository.getActivitiesByCampusAndDate.mock.mockImplementation(
      async () => expectedActivities,
    );

    const result = await service.getActivitiesInDateAndCampus(
      Campus.CESENA,
      d(9),
    );

    assert.strictEqual(mockActivityService.syncEvent.mock.calls.length, 1);
    assert.deepStrictEqual(result, expectedActivities);
  });
});
