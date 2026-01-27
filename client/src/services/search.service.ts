const API_URL = "/api/core";

export const searchService = {
  async findExactRooms(criteria: {
    campus: string;
    start: string;
    end: string;
  }): Promise<any[]> {
    const params = new URLSearchParams({
      campus: criteria.campus,
      start: criteria.start,
      end: criteria.end,
    });

    const response = await fetch(
      `${API_URL}/rooms/exact-free?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error("Error finding rooms");
    }
    return await response.json();
  },
};
