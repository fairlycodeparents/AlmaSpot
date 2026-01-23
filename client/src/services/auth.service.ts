const API_BASE = "/api/auth";

export const authService = {
  async login(creds: { email: string; password: string }) {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Login fallito");
    }

    return data;
  },

  async signUp(payload: { email: string; password: string }) {
    const response = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  },
};
