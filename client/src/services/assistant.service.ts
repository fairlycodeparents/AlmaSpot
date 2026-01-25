export interface AssistantSlot {
  id: string;
  name: string;
  type: string;
  campus: string;
  address: string;
  from: string;
  to: string;
}

export interface AssistantSearchResponse {
  plan: AssistantSlot[];
  response: string;
}

class AssistantService {
  async search(
    userMessages: string[],
    modelMessages: string[] = [],
  ): Promise<AssistantSearchResponse> {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessages,
        modelMessages,
      }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sessione scaduta");
      }
      throw new Error("Errore nella comunicazione con il server");
    }
    return await response.json();
  }
}

export const assistantService = new AssistantService();
