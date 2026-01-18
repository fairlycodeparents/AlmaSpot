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

describe("MongoRoomRepository Integration Test", async () => {
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

  await it("Dovrebbe salvare e recuperare le aule per Campus", async () => {
    const db = client.db(TEST_DB_NAME);
    const roomDoc = {
      _id: "AULA-TEST-1",
      name: "Aula Test",
      type: "CLASSROOM",
      campus: "Cesena",
      site: { campus: "Cesena", address: "Via X" },
      capacity: 50,
      equipment: [],
    };
    await db.collection("rooms").insertOne(roomDoc as any);
    const rooms = await repo.getRoomsByCampus(Campus.CESENA);

    assert.strictEqual(rooms.length, 1);
    assert.ok(rooms[0] instanceof Room);
    assert.strictEqual(rooms[0].id, "AULA-TEST-1");
    assert.strictEqual(rooms[0].campus, Campus.CESENA);
  });

  await it("Dovrebbe fetchare Activities Interne e recuperarle per data", async () => {
    const date = new Date("2026-03-20");
    const internalActivities: InternalActivity[] = [
      {
        id: "act-1",
        roomId: "AULA-TEST-1",
        title: "Lezione 1",
        type: ActivityType.INTERNAL_ACTIVITY,
        period: new Period(d(9), d(11)),
        professor: ["Prof. Rossi"],
        courseId: "123",
        campus: Campus.CESENA,
      },
      {
        id: "act-2",
        roomId: "AULA-TEST-2",
        title: "Lezione 2",
        type: ActivityType.INTERNAL_ACTIVITY,
        period: new Period(d(9), d(11)),
        professor: [],
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
  });

  await it("Dovrebbe salvare e cancellare una Activity Esterna", async () => {
    const extActivity: ExternalActivity = {
      id: "ext-1",
      roomId: "AULA-TEST-1",
      title: "Evento Studenti",
      type: ActivityType.EXTERNAL_ACTIVITY,
      description: "Party",
      period: new Period(d(14), d(16)),
      campus: Campus.CESENA,
      authorId: "user-123",
    };

    await repo.saveExternalActivity(extActivity);

    let events = await repo.getEventsPerRoom(
      "AULA-TEST-1",
      new Date("2026-03-20"),
    );
    assert.strictEqual(events.length, 1);
    assert.ok(events[0]);
    assert.strictEqual(events[0].id, "ext-1");

    await repo.deleteExternalActivity("ext-1");

    events = await repo.getEventsPerRoom("AULA-TEST-1", new Date("2026-03-20"));
    assert.strictEqual(events.length, 0);
  });

  await it("getLastSync deve tornare null se mai sincronizzato", async () => {
    const date = new Date("2099-01-01");
    const lastSync = await repo.getLastSync(Campus.CESENA, date);
    assert.strictEqual(lastSync, null);
  });

  await it("setLastSync deve salvare la data e getLastSync recuperarla", async () => {
    const date = new Date("2026-03-20");
    await repo.setLastSync(Campus.CESENA, date);

    const lastSync = await repo.getLastSync(Campus.CESENA, date);
    assert.ok(lastSync instanceof Date);

    const now = new Date();
    assert.ok(now.getTime() - lastSync.getTime() < 5000);
  });
});
