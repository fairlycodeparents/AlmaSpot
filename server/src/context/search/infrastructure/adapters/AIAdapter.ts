import { Slot } from "shared/domain/Slot";
import { Period } from "shared/domain/Period";
import { Campus } from "shared/domain/Location";
import { Plan } from "shared/domain/Plan";
import { AI } from "context/search/application/ports/OutboundPorts";
import {
  AvailableRoom,
  UserRequest,
  Suggestion,
} from "context/search/domain/Entities";
import { FunctionCallingConfigMode, GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

export const DEFAULT_RESPONSE =
  "I'm sorry, I couldn't process your request at the moment.";
export const ERROR_MESSAGE =
  "I couldn't process your request at the moment. Please check your API key and try again.";

export class AIAdapter implements AI {
  private ai = new GoogleGenAI({ apiKey: process.env["GEMINI_API_KEY"] });
  private readonly MODEL_NAME = "gemini-2.5-flash-lite";

  private readonly QUERY_DECLARATION = {
    name: "availability_query",
    description: "Extracts university room search parameters.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        start: { type: Type.STRING, description: "ISO 8601 start datetime" },
        end: { type: Type.STRING, description: "ISO 8601 end datetime" },
        city: {
          type: Type.STRING,
          enum: Object.values(Campus),
          description: "City to search in",
        },
        address: {
          type: Type.STRING,
          description: "Optional address within the city",
        },
      },
      required: ["start", "end", "city"],
    },
  };

  private readonly PLAN_DECLARATION = {
    name: "define_plan",
    description: "Proposed room allocation plan.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        slots: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              roomId: {
                type: Type.STRING,
                description: "Identifier of the room",
              },
              start: {
                type: Type.STRING,
                description: "ISO 8601 start datetime",
              },
              end: { type: Type.STRING, description: "ISO 8601 end datetime" },
            },
            required: ["roomId", "start", "end"],
          },
        },
        message_to_user: {
          type: Type.STRING,
          description: "Answer for the user: explain the plan briefly",
        },
      },
      required: ["slots", "message_to_user"],
    },
  };

  private readonly QUERY_SCHEMA = z.object({
    start: z.string(),
    end: z.string(),
    city: z.enum(Campus),
    address: z.string().optional(),
  });

  private readonly PLAN_SCHEMA = z.object({
    slots: z.array(
      z.object({
        roomId: z.string(),
        start: z.string(),
        end: z.string(),
      }),
    ),
    message_to_user: z.string(),
  });

  async getSuggestion(
    conversation: string[],
    availableRooms: AvailableRoom[],
  ): Promise<Suggestion> {
    let response;
    try {
      response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: this.buildContents(conversation),
        config: {
          tools: [
            {
              functionDeclarations: [this.PLAN_DECLARATION],
            },
          ],
          systemInstruction: this.buildSystemInstruction(
            "SUGGESTER",
            availableRooms,
          ),
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.ANY,
              allowedFunctionNames: ["define_plan"],
            },
          },
        },
      });

      const args = response.functionCalls?.[0]?.args;
      if (!args) {
        return new Suggestion(
          new Plan([]),
          response.text ? response.text : DEFAULT_RESPONSE,
        );
      }

      const parsed = this.PLAN_SCHEMA.safeParse(args);
      if (!parsed.success) {
        return new Suggestion(new Plan([]), DEFAULT_RESPONSE);
      }

      const data = parsed.data;
      const selectedSlots: Slot[] = [];
      for (const slot of data.slots) {
        const roomId = slot.roomId;
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        const originalSlot = availableRooms.find((s) => {
          return (
            s.id === roomId &&
            s.from.getTime() <= start.getTime() &&
            s.to.getTime() >= end.getTime()
          );
        });
        if (originalSlot) {
          selectedSlots.push(new Slot(roomId, new Period(start, end)));
        } else {
          console.warn(
            `Invalid room slot suggested by AI: ${JSON.stringify(slot)}
               Not found in available rooms: ${availableRooms.map((r) => r.id).join(", ")}`,
          );
        }
      }

      return new Suggestion(new Plan(selectedSlots), data.message_to_user);
    } catch (error) {
      console.error("Failed to generate content from AI model:", error);
      return new Suggestion(new Plan([]), ERROR_MESSAGE);
    }
  }

  async extractRequest(conversation: string[]): Promise<UserRequest | string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: this.buildContents(conversation),
        config: {
          systemInstruction: this.buildSystemInstruction("EXTRACTOR"),
          tools: [
            {
              functionDeclarations: [this.QUERY_DECLARATION],
            },
          ],
        },
      });

      const args = response.functionCalls?.[0]?.args;
      if (!args) {
        return response.text ? response.text : DEFAULT_RESPONSE;
      }

      const parsed = this.QUERY_SCHEMA.safeParse(args);
      if (!parsed.success) {
        return DEFAULT_RESPONSE;
      }

      return new UserRequest(
        new Period(new Date(parsed.data.start), new Date(parsed.data.end)),
        parsed.data.city,
        parsed.data.address,
      );
    } catch (error) {
      console.error("Failed to generate content from AI model:", error);
      return ERROR_MESSAGE;
    }
  }

  private buildContents(conversation: string[]) {
    return conversation.map((text) => ({
      role: "user",
      parts: [{ text }],
    }));
  }

  private buildSystemInstruction(
    mode: "EXTRACTOR" | "SUGGESTER",
    rooms?: AvailableRoom[],
  ): string {
    const now = new Date();
    const context = `
      CURRENT_TIME: ${now.toString()}
      TIMEZONE: Europe/Rome
      LOCALE: Italian
      
      BEHAVIOR:
      - Use ONLY the provided tools for structured data.
      - If data is missing for a tool, ask for it briefly.
      - If data is not missing but unclear, make your best guess. Do NOT ask for clarification/confirmation.
    `;

    if (mode === "EXTRACTOR") {
      return `
        ${context}
        TASK: Extract search parameters (campus, start, end). Resolve relative times like 'tomorrow' or 'in 2 hours' based on CURRENT_TIME.
      `;
    }
    return `
      ${context}
      AVAILABLE_ROOMS: ${JSON.stringify(
        rooms?.map((room) => ({
          id: room.id,
          name: room.name,
          from: room.from.toString(),
          to: room.to.toString(),
          address: room.address,
        })),
      )}
      TASK: Create a plan, allocating rooms from AVAILABLE_ROOMS to cover the entire requested period.
      If more plans are possible, choose the one with fewer room changes.
      In message_to_user, only use room name from the provided list (never the id).
    `;
  }
}
