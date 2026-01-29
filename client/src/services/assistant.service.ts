export interface AssistantSlot {
  id: string;
  name: string;
  type: string;
  campus: string;
  address: string;
  from: Date;
  to: Date;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface AssistantResponse {
  plan?: AssistantSlot[];
  response: string;
}

export interface RawAssistantResponse {
  plan?: Array<any>;
  response: string;
}

class AssistantService {
  async search(history: ChatMessage[]): Promise<AssistantResponse> {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sessione scaduta");
      }
      throw new Error("Errore nella comunicazione con il server");
    }

    const data = (await response.json()) as RawAssistantResponse;

    return {
      response: data.response,
      plan: data.plan
        ? data.plan.map((slot) => ({
            ...slot,
            from: new Date(slot.from),
            to: new Date(slot.to),
          }))
        : undefined,
    };
  }
}

export const assistantService = new AssistantService();
