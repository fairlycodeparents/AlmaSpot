import type { LoginDto, SignUpDto, AuthResponse } from "@/types/api";

const API_BASE = "/api/auth";

async function publicFetch(url: string, options: RequestInit) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error("Errore server imprevisto (Formato non valido)");
  }

  if (!response.ok) {
    throw data;
  }

  return data;
}

export const authService = {
  async login(creds: LoginDto): Promise<AuthResponse> {
    return publicFetch(`${API_BASE}/login`, {
      method: "POST",
      body: JSON.stringify(creds),
    });
  },

  async signUp(payload: SignUpDto): Promise<{ message: string }> {
    return publicFetch(`${API_BASE}/signup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
