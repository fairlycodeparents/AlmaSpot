import { Slot } from "shared/domain/Slot";
import { Period } from "shared/domain/Period";
import { Campus } from "shared/domain/Location";
import { AI } from "context/search/application/ExternalPorts";
import { AvailabilityQuery, Suggestion } from "context/search/domain/Entities";
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

  config = {
    tools: [
      { functionDeclarations: [this.setAvailabilityQueryDeclaration as any] },
    ],
  };

  getPlanGivenUserInput(
    _userInput: string[],
    _availableSlots: Slot[],
  ): Promise<Suggestion> {
    return Promise.reject("TODO: Method not implemented.");
  }

  async getQueryGivenUserInput(
    userInput: string[],
  ): Promise<AvailabilityQuery> {
    const input = [
      "Current time is ${new Date().toISOString()}. Use this to resolve relative dates like 'tomorrow'",
      ...userInput,
    ];

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: input,
      config: this.config,
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

    return new AvailabilityQuery(
      new Period(startDate, endDate),
      campusValue,
      args.address,
    );
  }
}
