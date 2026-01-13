import { Db, MongoClient } from "mongodb";
import { RoomRepository } from "../../domain/ports/RoomRepository";
import { Campus, Site } from "../../../../shared/domain/Location";
import {
  Activity,
  ActivityType,
  ExternalActivity,
  InternalActivity,
} from "../../domain/model/Activity";
import { Room, RoomType } from "../../domain/model/Room";
import { Period } from "../../../../shared/domain/Period";

export class RoomRepositoryMongo implements RoomRepository {
  private db: Db;

  constructor(client: MongoClient, dbName: string) {
    this.db = client.db(dbName);
  }

  private get roomsCol() {
    return this.db.collection("rooms");
  }
  private get activitiesCol() {
    return this.db.collection("activities");
  }
  private get metadataCol() {
    return this.db.collection("metadata");
  }

  async getRooms(): Promise<Room[]> {
    const docs = await this.roomsCol.find({}).toArray();
    return docs.map(this.toRoomEntity);
  }

  async getRoomsBySite(site: Site): Promise<Room[]> {
    const docs = await this.roomsCol.find({ site: site }).toArray();
    return docs.map(this.toRoomEntity);
  }

  async getRoomsByCampus(campus: Campus): Promise<Room[]> {
    const docs = await this.roomsCol.find({ campus: campus }).toArray();
    return docs.map(this.toRoomEntity);
  }

  async getRoomCampus(roomId: string): Promise<Campus> {
    const doc = await this.roomsCol.findOne({ id: roomId });
    if (!doc) {
      throw new Error(`Room with id ${roomId} not found`);
    }
    return doc["campus"];
  }

  async getRoomSite(roomId: string): Promise<Site> {
    const doc = await this.roomsCol.findOne({ id: roomId });
    if (!doc) {
      throw new Error(`Room with id ${roomId} not found`);
    }
    return doc["site"];
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

  async deleteExternalActivity(activityId: string): Promise<void> {
    await this.activitiesCol.deleteOne({
      id: activityId,
      type: ActivityType.EXTERNAL_ACTIVITY,
    });
  }

  async saveExternalActivity(activityId: ExternalActivity): Promise<void> {
    const doc = {
      _id: activityId,
      roomId: activityId.roomId,
      campus: activityId.campus,
      title: activityId.title,
      type: ActivityType.EXTERNAL_ACTIVITY,
      description: activityId.description,
      authorId: activityId.authorId,
      period: { start: activityId.period.start, end: activityId.period.end },
    };

    await this.activitiesCol.insertOne(doc);
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
      "period.start": { $lt: end },
      "period.end": { $gt: start },
    });

    if (activities.length > 0) {
      const docs = activities.map((act) => ({
        ...act,
        _id: act.id,
        period: { start: act.period.start, end: act.period.end },
      }));
      await this.activitiesCol.insertMany(docs);
    }
  }

  async getLastSync(_campus: Campus, _date: Date): Promise<Date | null> {
    const doc = await this.metadataCol.findOne({
      id: `sync_${_campus}_${_date}`,
    });
    return doc ? new Date(doc["lastSync"]) : null;
  }

  async setLastSync(_campus: Campus, _date: Date): Promise<void> {
    await this.metadataCol.updateOne(
      { id: `sync_${_campus}_${_date}` },
      { $set: { lastSync: new Date() } },
      { upsert: true },
    );
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
      doc._id,
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
      id: doc._id,
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
