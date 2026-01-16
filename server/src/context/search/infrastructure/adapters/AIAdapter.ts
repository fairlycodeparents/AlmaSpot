import { Slot } from "shared/domain/Slot";
import { Period } from "shared/domain/Period";
import { Campus } from "shared/domain/Location";
import { Plan } from "shared/domain/Plan";
import { AI } from "context/search/application/ExternalPorts";
import {
  AvailableRoom,
  UserRequest,
  Suggestion,
} from "context/search/domain/Entities";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

export const DEFAULT_RESPONSE =
  "I'm sorry, I couldn't process your request at the moment.";
export const ERROR_MESSAGE =
  "I couldn't process your request at the moment. Please check your API key and try again.";

export class AIAdapter implements AI {
  private ai = new GoogleGenAI({ apiKey: process.env["GEMINI_API_KEY"] });
  private readonly MODEL_NAME = "gemini-2.5-flash"; // TODO: lite

  private readonly QUERY_DECLARATION = {
    name: "extract_availability_query",
    description: "Extracts structured availability query parameters.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        start: { type: Type.STRING, description: "Start datetime in ISO 8601" },
        end: { type: Type.STRING, description: "End datetime in ISO 8601" },
        campus: {
          type: Type.STRING,
          enum: Object.values(Campus),
          description: "Campus where to find a room",
        },
        address: {
          type: Type.STRING,
          description: "Optional address within the campus to find a room",
        },
      },
      required: ["start", "end", "campus"],
    },
  };

  private readonly PLAN_DECLARATION = {
    name: "define_plan",
    description:
      "Defines a plan composed of one or more slots to cover the user's requested time period.",
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
                description: "The ID of the selected room for this step",
              },
              start: {
                type: Type.STRING,
                description: "Start datetime for this step (ISO 8601)",
              },
              end: {
                type: Type.STRING,
                description: "End datetime for this step (ISO 8601)",
              },
            },
            required: ["roomId", "start", "end"],
          },
        },
        explanation: {
          type: Type.STRING,
          description:
            "Answer to the user's last message, or explain why no plan could be made.",
        },
      },
      required: ["slots", "explanation"],
    },
  };

  private readonly QUERY_SCHEMA = z.object({
    start: z.string(),
    end: z.string(),
    campus: z.enum(Campus),
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
    explanation: z.string(),
  });

  async getSuggestion(
    conversation: string[],
    availableRooms: AvailableRoom[],
  ): Promise<Suggestion> {
    const availabilityContext = availableRooms.map((room) => ({
      roomId: room.id,
      roomType: room.type,
      roomAddress: room.address,
      availabilityStart: room.from.toString(),
      availabilityEnd: room.to.toString(),
    }));

    const systemInstruction = `
    Here is the list of AVAILABLE rooms, with their availability periods:
    ${JSON.stringify(availabilityContext)}

    INSTRUCTIONS:
      1. Analyze the user's request (time range) and the available rooms.
      2. If one room covers the whole period, select it.
      3. If no single room works, try to combine multiple rooms (e.g., Room A from 9-11, Room B from 11-13) to minimize room switches.
      4. If no valid combination exists, return an empty "slots" list.
      5. Always provide a clear "explanation" (e.g., "I couldn't find a single room, but you can use Room A then move to Room B").`;

    let response;
    try {
      response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: this.buildPrompt([...conversation, systemInstruction]),
        config: {
          tools: [{ functionDeclarations: [this.PLAN_DECLARATION] }],
        },
      });
    } catch (error) {
      console.error("Failed to generate content from AI model:", error);
      return new Suggestion(new Plan([]), ERROR_MESSAGE);
    }

    const args = response.functionCalls?.[0]?.args;

    if (!args) {
      return new Suggestion(new Plan([]), DEFAULT_RESPONSE);
    }

    const parsed = this.PLAN_SCHEMA.safeParse(args);

    if (!parsed.success) {
      return new Suggestion(new Plan([]), DEFAULT_RESPONSE);
    }

    const data = parsed.data;

    const selectedSlots: Slot[] = [];

    for (const slot of data.slots) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);

      const originalSlot = availableRooms.find((s) => {
        return (
          s.id === slot.roomId &&
          s.from.getTime() <= start.getTime() &&
          s.to.getTime() >= end.getTime()
        );
      });

      if (originalSlot) {
        const plannedSlot = new AvailableRoom(
          originalSlot.id,
          originalSlot.type,
          originalSlot.address,
          start,
          end,
        );
        selectedSlots.push(plannedSlot.toSlot());
      } else {
        console.warn(
          `Invalid room slot suggested by AI: ${JSON.stringify(slot)}
           Not found in available rooms: ${availableRooms.map((r) => r.id).join(", ")}`,
        );
      }
    }

    return new Suggestion(new Plan(selectedSlots), data.explanation);
  }

  async extractRequest(conversation: string[]): Promise<UserRequest | string> {
    let response;
    try {
      response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: this.buildPrompt(conversation),
        config: {
          tools: [{ functionDeclarations: [this.QUERY_DECLARATION] }],
        },
      });
    } catch (error) {
      console.error("Failed to generate content from AI model:", error);
      return ERROR_MESSAGE;
    }

    const args = response.functionCalls?.[0]?.args;

    if (!args) {
      return DEFAULT_RESPONSE;
    }

    const parsed = this.QUERY_SCHEMA.safeParse(args);

    if (!parsed.success) {
      return DEFAULT_RESPONSE;
    }

    const data = parsed.data;

    return new UserRequest(
      new Period(new Date(data.start), new Date(data.end)),
      data.campus,
      data.address,
    );
  }

  /**
   * Builds the prompt for the AI model by appending the current system time.
   * @param parts - The parts of the prompt
   * @returns The complete prompt, formatted for the AI model, including current time information.
   */
  private buildPrompt(
    parts: string[],
  ): Array<{ role: string; parts: Array<{ text: string }> }> {
    const systemTime = `
      Current Time: ${new Date().toString()}.
      Use it to understand the current date and time, and relative references like 'tomorrow'.`;
    return [...parts, systemTime].map((text) => ({
      role: "user",
      parts: [{ text }],
    }));
  }
}
