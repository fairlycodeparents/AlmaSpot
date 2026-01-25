const API_BASE = "/api/core";

export const adminService = {
  async searchRooms(params: { campus: string; start: string; end: string }) {
    const query = new URLSearchParams({
      campus: params.campus,
      start: params.start,
      end: params.end,
    }).toString();

    const response = await fetch(`${API_BASE}/rooms/free-by-campus?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },

  async addActivity(payload: any) {
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
};
