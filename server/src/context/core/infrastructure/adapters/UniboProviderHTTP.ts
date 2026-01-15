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
  private baseUrl =
    process.env["UNIBO_SERVICE_URL"] || "http://unibo-provider:8080";

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
          id: `unibo_${item.course_id}_${new Date(item.start).getTime()}`,
          roomId: item.room_code,
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
}
