import "dotenv/config";
import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { MongoClient } from "mongodb";
import { MongoRoomRepository } from "./MongoRoomRepository";
import { Room } from "../../../domain/model/Room";
import { Campus } from "../../../../../shared/domain/Location";
import {
  ActivityType,
  ExternalActivity,
  InternalActivity,
} from "../../../domain/model/Activity";
import { Period } from "../../../../../shared/domain/Period";

const TEST_DB_URL = process.env["MONGO_URI"];
const TEST_DB_NAME = "almaspot_integration_test";

describe("MongoRoomRepository Test", async () => {
  let client: MongoClient;
  let repo: MongoRoomRepository;

  before(async () => {
    if (TEST_DB_URL != null) {
      client = new MongoClient(TEST_DB_URL);
    }
    await client.connect();
    repo = new MongoRoomRepository(client, TEST_DB_NAME);
  });

  after(async () => {
    await client.close();
  });

  beforeEach(async () => {
    const db = client.db(TEST_DB_NAME);
    await db.collection("rooms").deleteMany({});
    await db.collection("activities").deleteMany({});
    await db.collection("sync_metadata").deleteMany({});
  });

  const d = (h: number) =>
    new Date(`2026-03-20T${h.toString().padStart(2, "0")}:00:00`);

  await it("getRoomsByCampus: should retrieve rooms by specified campus", async () => {
    const db = client.db(TEST_DB_NAME);
    const roomDoc = {
      _id: "aula-test-1-ce",
      name: "Aula Test 1",
      type: "CLASSROOM",
      campus: "Cesena",
      site: { campus: "Cesena", address: "Via X" },
    };
    await db.collection("rooms").insertOne(roomDoc as any);
    const rooms = await repo.getRoomsByCampus(Campus.CESENA);

    assert.strictEqual(rooms.length, 1);
    assert.ok(rooms[0] instanceof Room);
    assert.strictEqual(rooms[0].id, "aula-test-1-ce");
    assert.strictEqual(rooms[0].campus, Campus.CESENA);
  });

  await it("updateInternalActivities: should update internal activities without errors", async () => {
    const date = new Date("2026-03-20");
    const internalActivities: InternalActivity[] = [
      {
        id: "int-123-20260320-0900",
        roomId: "aula-test-1-ce",
        title: "Lezione 1",
        type: ActivityType.INTERNAL_ACTIVITY,
        period: new Period(d(9), d(11), date),
        professor: ["Prof. Rossi"],
        courseId: "123",
        campus: Campus.CESENA,
      },
      {
        id: "int-456-20260320-0900",
        roomId: "aula-test-2-ce",
        title: "Lezione 2",
        type: ActivityType.INTERNAL_ACTIVITY,
        period: new Period(d(9), d(11), date),
        professor: ["Prof. Bianchi"],
        courseId: "456",
        campus: Campus.CESENA,
      },
    ];

    await repo.updateInternalActivities(
      Campus.CESENA,
      date,
      internalActivities,
    );
    const retrieved = await repo.getActivitiesByCampusAndDate(
      Campus.CESENA,
      date,
    );

    assert.strictEqual(retrieved.length, 2);
    assert.ok(retrieved[0]);
    assert.strictEqual(retrieved[0].title, "Lezione 1");
    assert.ok(retrieved[1]);
    assert.strictEqual(retrieved[1].title, "Lezione 2");
  });

  await it("save and delete ExternalActivity: should correctly save and delete an external activity", async () => {
    const extActivity: ExternalActivity = {
      id: "ext-evento-studenti-20260320-1400",
      roomId: "aula-test-1-ce",
      title: "Evento Studenti",
      type: ActivityType.EXTERNAL_ACTIVITY,
      period: new Period(d(14), d(16)),
      campus: Campus.CESENA,
      authorId: "user-123",
    };

    await repo.saveExternalActivity(extActivity);

    let events = await repo.getEventsPerRoom(
      "aula-test-1-ce",
      new Date("2026-03-20"),
    );
    assert.strictEqual(events.length, 1);
    assert.ok(events[0]);
    assert.strictEqual(events[0].id, "ext-evento-studenti-20260320-1400");

    await repo.deleteExternalActivity("ext-evento-studenti-20260320-1400");

    events = await repo.getEventsPerRoom(
      "aula-test-1-ce",
      new Date("2026-03-20"),
    );
    assert.strictEqual(events.length, 0);
  });

  await it("getLastSync: should return null if never synchronized", async () => {
    const date = new Date("2099-01-01");
    const lastSync = await repo.getLastSync(Campus.CESENA, date);
    assert.strictEqual(lastSync, null);
  });

  await it("setLastSync: should set last sync date", async () => {
    const date = new Date("2026-03-20");
    await repo.setLastSync(Campus.CESENA, date);

    const lastSync = await repo.getLastSync(Campus.CESENA, date);
    assert.ok(lastSync instanceof Date);

    const now = new Date();
    assert.ok(now.getTime() - lastSync.getTime() < 5000);
  });
});
