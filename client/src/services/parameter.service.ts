const API_URL = "/api/core";

export const parameterService = {
  async getCampuses(): Promise<string[]> {
    const response = await fetch(`${API_URL}/metadata/campuses`);
    if (!response.ok) {
      throw new Error("Error retrieving campuses");
    }
    return await response.json();
  },
};
