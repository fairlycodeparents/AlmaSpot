import { Db, MongoClient, Collection } from "mongodb";
import { RoomRepository } from "../../../domain/ports/RoomRepository";
import { Campus, Site } from "../../../../../shared/domain/Location";
import {
  Activity,
  ActivityType,
  ExternalActivity,
  InternalActivity,
} from "../../../domain/model/Activity";
import { Room, RoomType } from "../../../domain/model/Room";
import { Period } from "../../../../../shared/domain/Period";

export class MongoRoomRepository implements RoomRepository {
  private db: Db;

  constructor(client: MongoClient, dbName: string) {
    this.db = client.db(dbName);

    this.initializeIndexes().catch((err) =>
      console.error("[MongoRepo] Failed to initialize indexes:", err),
    );
  }

  private async initializeIndexes() {
    try {
      await this.activitiesCol.createIndex(
        { "period.end": 1 },
        { expireAfterSeconds: 24 * 60 * 60, background: true },
      );
      await this.activitiesCol.createIndex(
        { campus: 1, "period.start": 1 },
        { background: true },
      );

      await this.roomsCol.createIndex({ campus: 1 }, { background: true });
      await this.roomsCol.createIndex(
        { "site.campus": 1, "site.address": 1 },
        { background: true },
      );

      await this.metadataCol.createIndex(
        { lastSync: 1 },
        { expireAfterSeconds: 7 * 24 * 60 * 60, background: true },
      );
    } catch (e) {
      console.error("[MongoRepo] Error creating indexes:", e);
    }
  }

  private get roomsCol(): Collection<any> {
    return this.db.collection("rooms");
  }
  private get activitiesCol(): Collection<any> {
    return this.db.collection("activities");
  }
  private get metadataCol(): Collection<any> {
    return this.db.collection("metadata");
  }

  async getRooms(): Promise<Room[]> {
    const docs = await this.roomsCol.find({}).toArray();
    return docs.map(this.toRoomEntity);
  }

  async getRoomsBySite(site: Site): Promise<Room[]> {
    const docs = await this.roomsCol
      .find({ "site.campus": site.campus, "site.address": site.address })
      .toArray();
    return docs.map(this.toRoomEntity);
  }

  async getRoomsByCampus(campus: Campus): Promise<Room[]> {
    const docs = await this.roomsCol.find({ campus: campus }).toArray();
    return docs.map(this.toRoomEntity);
  }

  async getSitesByCampus(campus: Campus): Promise<Site[]> {
    const sites = await this.roomsCol
      .aggregate([
        { $match: { campus: campus } },
        { $group: { _id: "$site" } },
        { $replaceRoot: { newRoot: "$_id" } },
      ])
      .toArray();

    return sites.map((s) => new Site(s["campus"], s["address"]));
  }

  async getEventsPerRoom(roomId: string, date?: Date): Promise<Activity[]> {
    const query: any = { roomId: roomId };
    if (date) {
      const { start, end } = this.getDayRange(date);
      query["period.start"] = { $lt: end };
      query["period.end"] = { $gt: start };
    }
    const docs = await this.activitiesCol.find(query).toArray();
    return docs.map(this.toActivityEntity);
  }

  async getActivitiesByCampusAndDate(
    campus: Campus,
    date: Date,
  ): Promise<Activity[]> {
    const { start, end } = this.getDayRange(date);
    const docs = await this.activitiesCol
      .find({
        campus: campus,
        "period.start": { $lt: end },
        "period.end": { $gt: start },
      })
      .toArray();

    return docs.map(this.toActivityEntity);
  }

  async getActivityById(activityId: string): Promise<Activity | null> {
    const doc = await this.activitiesCol.findOne({ _id: activityId });
    return doc ? this.toActivityEntity(doc) : null;
  }

  async deleteExternalActivity(activityId: string): Promise<void> {
    await this.activitiesCol.deleteOne({
      _id: activityId,
      type: ActivityType.EXTERNAL_ACTIVITY,
    });
  }

  async saveExternalActivity(activityId: ExternalActivity): Promise<void> {
    const doc = {
      id: activityId.id,
      roomId: activityId.roomId,
      campus: activityId.campus,
      title: activityId.title,
      type: ActivityType.EXTERNAL_ACTIVITY,
      authorId: activityId.authorId,
      period: { start: activityId.period.start, end: activityId.period.end },
    };

    await this.activitiesCol.updateOne(
      { _id: activityId.id },
      { $set: doc },
      { upsert: true },
    );
  }

  async updateInternalActivities(
    campus: Campus,
    date: Date,
    activities: InternalActivity[],
  ): Promise<void> {
    const { start, end } = this.getDayRange(date);

    await this.activitiesCol.deleteMany({
      type: ActivityType.INTERNAL_ACTIVITY,
      campus: campus,
      "period.start": { $gte: start, $lte: end },
    });

    if (activities.length > 0) {
      const docs = activities.map((act) => ({
        _id: act.id,
        ...act,
        period: { start: act.period.start, end: act.period.end },
      }));
      try {
        await this.activitiesCol.insertMany(docs, { ordered: false });
      } catch (e) {
        console.warn("Duplicate keys during bulk insert", e);
      }
    }
  }

  async getLastSync(campus: Campus, date: Date): Promise<Date | null> {
    const id = this.getSyncKey(campus, date);
    const doc = await this.metadataCol.findOne({ _id: id });
    return doc ? new Date(doc["lastSync"]) : null;
  }

  async setLastSync(campus: Campus, date: Date): Promise<void> {
    const id = this.getSyncKey(campus, date);
    await this.metadataCol.updateOne(
      { _id: id },
      { $set: { lastSync: new Date() } },
      { upsert: true },
    );
  }

  private getSyncKey(campus: Campus, date: Date): string {
    const dateStr = date.toISOString().split("T")[0];
    return `sync_${campus}_${dateStr}`;
  }

  private getDayRange(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  private toRoomEntity(doc: any): Room {
    return new Room(
      doc.id,
      doc.name,
      doc.type as RoomType,
      doc.campus as Campus,
      doc.site as Site,
    );
  }

  private toActivityEntity(doc: any): Activity {
    const period = new Period(
      new Date(doc.period.start),
      new Date(doc.period.end),
    );

    const base = {
      id: doc.id,
      roomId: doc.roomId,
      campus: doc.campus,
      title: doc.title,
      period: period,
      type: doc.type,
    };

    if (doc.type === ActivityType.INTERNAL_ACTIVITY) {
      return {
        ...base,
        type: ActivityType.INTERNAL_ACTIVITY,
        courseId: doc.courseId,
        professor: doc.professor,
      } as InternalActivity;
    } else {
      return {
        ...base,
        type: ActivityType.EXTERNAL_ACTIVITY,
        description: doc.description,
        authorId: doc.authorId,
      } as ExternalActivity;
    }
  }
}
