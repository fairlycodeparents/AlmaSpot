import type {
  RoomAvailabilityDTO,
  CreateActivityDTO,
  ActivityDTO,
} from "@/types/api";

const API_BASE = "/api/core";

async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { message: "Errore di comunicazione (Risposta non valida)" };
  }

  if (response.status === 401) {
    forceLogout();
  }

  if (response.status === 500) {
    const rawContent = text.toLowerCase();

    if (
      rawContent.includes("unauthorized") ||
      rawContent.includes("invalid admin token") ||
      rawContent.includes("jwt expired") ||
      rawContent.includes("sessione scaduta")
    ) {
      console.warn("Rilevato Token Scaduto dentro errore 500 -> Logout");
      forceLogout();
    }
  }

  if (!response.ok) {
    throw data;
  }

  return data;
}

function forceLogout() {
  localStorage.removeItem("authToken");
  window.location.replace("/login");
  throw new Error("Sessione scaduta.");
}

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

    return authFetch(`${API_BASE}/rooms/exact-free?${query}`, {
      method: "GET",
    });
  },

  async addActivity(payload: CreateActivityDTO): Promise<void> {
    return authFetch(`${API_BASE}/activities/external`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getActivities(campus: string, date: string): Promise<ActivityDTO[]> {
    const query = new URLSearchParams({ campus, date }).toString();
    return authFetch(`${API_BASE}/activities?${query}`, {
      method: "GET",
    });
  },

  async deleteActivity(activityId: string): Promise<boolean> {
    await authFetch(`${API_BASE}/activities/external/${activityId}`, {
      method: "DELETE",
    });
    return true;
  },
};
