interface AssistantSearchResponse {
  plan: {
    slots: Array<{
      roomId: string;
      start: string;
      end: string;
    }>;
    explanation: string;
  };
  response: string;
}

class AssistantService {
  async search(userMessages: string[]): Promise<AssistantSearchResponse> {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessages }),
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
