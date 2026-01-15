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

export class AIAdapter implements AI {
  private ai = new GoogleGenAI({ apiKey: process.env["GEMINI_API_KEY"] });

  private setAvailabilityQueryDeclaration = {
    name: "extract_availability_query",
    description:
      "Extracts structured availability query parameters from natural language.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        start: {
          type: Type.STRING,
          description: "Start datetime in ISO 8601",
        },
        end: {
          type: Type.STRING,
          description: "End datetime in ISO 8601",
        },
        campus: {
          type: Type.STRING,
          enum: Object.values(Campus),
          description: "Campus where the user wants to find a room",
        },
        address: {
          type: Type.STRING,
          description: "Optional address within the campus to find a room",
        },
      },
      required: ["start", "end", "campus"],
    },
  };

  private definePlanDeclaration = {
    name: "define_plan",
    description:
      "Defines a plan composed of one or more slots to cover the user's requested time period.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        steps: {
          type: Type.ARRAY,
          description:
            "List of selected slots. Empty if no suitable slots match the request.",
          items: {
            type: Type.OBJECT,
            properties: {
              roomId: {
                type: Type.STRING,
                description: "The ID of the selected room for this step",
              },
              start: {
                type: Type.STRING,
                description: "Start time for this step (ISO 8601)",
              },
              end: {
                type: Type.STRING,
                description: "End time for this step (ISO 8601)",
              },
            },
            required: ["roomId", "start", "end"],
          },
        },
        explanation: {
          type: Type.STRING,
          description:
            "A message to the user describing the plan or explaining why no plan was found.",
        },
      },
      required: ["steps", "explanation"],
    },
  };

  async getSuggestion(
    conversation: string[],
    availableSlots: AvailableRoom[],
  ): Promise<Suggestion> {
    const slotsContext = availableSlots.map((s) => ({
      roomId: s.id,
      roomType: s.type,
      roomAddress: s.address,
      availabilityStart: s.from.toString(),
      availabilityEnd: s.to.toString(),
    }));

    const now = new Date();

    const systemInstruction = `
    You are a smart room booking assistant.
    Current Reference Time: ${now.toString()}.
    Use this to resolve relative dates like 'tomorrow' or understand the user's time references.
    
    Here is the list of ACTUALLY AVAILABLE slots:
    ${JSON.stringify(slotsContext)}

    INSTRUCTIONS:
      1. Analyze the user's request (time range) and the available slots.
      2. If one slot covers the whole period, select it.
      3. If no single slot works, try to combine multiple slots (e.g., Room A from 9-11, Room B from 11-13) to minimize room switches.
      4. If no valid combination exists, return an empty "steps" list.
      5. Always provide a clear "explanation" (e.g., "I couldn't find a single room, but you can use Room A then move to Room B").
      `;

    const input = [...conversation, systemInstruction];

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: input.map((text) => ({ role: "user", parts: [{ text }] })),
      config: {
        tools: [{ functionDeclarations: [this.definePlanDeclaration as any] }],
      },
    });

    const funCall = response.functionCalls?.[0];

    if (!funCall || !funCall.args) {
      throw new Error("AI failed to generate a structured plan.");
    }

    const args = funCall.args as any;
    const stepsData = args.steps || [];
    const explanation = args.explanation || "No plan description provided.";

    const selectedSlots: Slot[] = [];

    for (const step of stepsData) {
      const stepStart = new Date(step.start);
      const stepEnd = new Date(step.end);

      const originalSlot = availableSlots.find((s) => {
        return (
          s.id === step.roomId &&
          s.from.getTime() <= stepStart.getTime() &&
          s.to.getTime() >= stepEnd.getTime()
        );
      });

      if (originalSlot) {
        const plannedSlot = new AvailableRoom(
          originalSlot.id,
          originalSlot.type,
          originalSlot.address,
          stepStart,
          stepEnd,
        );
        selectedSlots.push(plannedSlot.toSlot());
      } else {
        console.log(
          `AI suggested a slot that fits no available period: ${JSON.stringify(step)}`,
        );
      }
    }

    return new Suggestion(new Plan(selectedSlots), explanation);
  }

  async extractRequest(conversation: string[]): Promise<UserRequest> {
    const input = [
      `Current time is ${new Date().toString()}.
      Use this to resolve relative dates like 'tomorrow' and to better understand the user's time references.`,
      ...conversation,
    ];

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: input,
      config: {
        tools: [
          {
            functionDeclarations: [this.setAvailabilityQueryDeclaration as any],
          },
        ],
      },
    });

    const funCall = response.functionCalls?.[0];

    if (!funCall || !funCall.args) {
      throw new Error("AI did not return a valid function call.");
    }

    const args = funCall.args as any;

    if (!args.start || !args.end || !args.campus) {
      throw new Error(
        `Missing required fields in AI response: ${JSON.stringify(args)}`,
      );
    }

    const startDate = new Date(args.start);
    const endDate = new Date(args.end);

    const campusValue = Object.values(Campus).includes(args.campus)
      ? (args.campus as Campus)
      : null;

    if (!campusValue) {
      throw new Error(`Unrecognized campus value: ${args.campus}`);
    }

    return new UserRequest(
      new Period(startDate, endDate),
      campusValue,
      args.address,
    );
  }
}
