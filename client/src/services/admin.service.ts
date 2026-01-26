import type {
  RoomAvailabilityDTO,
  CreateActivityDTO,
  ActivityDTO,
} from "@/types/api";

const API_BASE = "/api/core";

export const adminService = {
  async searchRooms(params: {
    campus: string;
    start: string;
    end: string;
  }): Promise<RoomAvailabilityDTO[]> {
    const query = new URLSearchParams({
      campus: params.campus,
      start: params.start,
      end: params.end,
    }).toString();

    const response = await fetch(`${API_BASE}/rooms/exact-free?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  async addActivity(payload: CreateActivityDTO): Promise<void> {
    const response = await fetch(`${API_BASE}/activities/external`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  async getActivities(campus: string, date: string): Promise<ActivityDTO[]> {
    const query = new URLSearchParams({ campus, date }).toString();

    const response = await fetch(`${API_BASE}/activities?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  async deleteActivity(activityId: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE}/activities/external/${activityId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }
    return true;
  },
};
