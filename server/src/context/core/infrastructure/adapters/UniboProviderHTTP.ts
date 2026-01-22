import { InternalActivity, ActivityType } from "../../domain/model/Activity";
import { Campus } from "../../../../shared/domain/Location";
import { Period } from "../../../../shared/domain/Period";
import { UniboProvider } from "../../domain/ports/ServicePorts";

interface GoActivityDTO {
  title: string;
  start: string;
  end: string;
  room_code: string;
  professors: string[];
  course_id: string;
}

export class UniboProviderHTTP implements UniboProvider {
  private baseUrl = process.env["UNIBO_SERVICE_URL"];

  async fetchInternalActivities(
    campus: Campus,
    date: Date,
  ): Promise<InternalActivity[]> {
    const dateStr = date.toISOString().split("T")[0];
    const url = `${this.baseUrl}/api/v1/activities?campus=${encodeURIComponent(campus)}&date=${dateStr}`;

    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(
          `[UniboProvider] Error while fetching data: Error: Status: ${res.status}`,
        );

      const data = (await res.json()) as GoActivityDTO[];
      const activities: InternalActivity[] = [];

      for (const item of data) {
        activities.push({
          id: this.generateInternalActivityId(
            item.course_id,
            new Date(item.start),
          ),
          roomId: this.generateRoomId(item.room_code, campus),
          campus: campus,
          title: item.title,
          type: ActivityType.INTERNAL_ACTIVITY,
          period: new Period(new Date(item.start), new Date(item.end)),
          professor: item.professors,
          courseId: item.course_id,
        });
      }
      return activities;
    } catch (err) {
      console.error("[UniboProvider] Error while fetching data:", err);
      throw err;
    }
  }

  private generateRoomId(roomName: string, campus: Campus): string {
    const roomSlug = roomName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/--+/g, "-");

    const campusPrefix = campus.toLowerCase();

    return `${campusPrefix}-${roomSlug}`;
  }

  private generateInternalActivityId(courseId: string, start: Date): string {
    const dateStr = start.toISOString().slice(0, 10).replace(/-/g, ""); // 20241025
    const timeStr = start.toISOString().slice(11, 16).replace(/:/g, ""); // 0930

    return `int-${courseId}-${dateStr}-${timeStr}`;
  }
}
