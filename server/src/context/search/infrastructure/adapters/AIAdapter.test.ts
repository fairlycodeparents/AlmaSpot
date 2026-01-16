import { describe, it } from "node:test";
import assert from "node:assert";
import { AIAdapter } from "./AIAdapter";
import { Campus } from "shared/domain/Location";
import { UserRequest, AvailableRoom } from "context/search/domain/Entities";

const GEMINI_KEY = process.env["GEMINI_API_KEY"];
const todayAt = (hour: number) => new Date(new Date().setHours(hour, 0, 0, 0));

describe(
  "AI Adapter",
  { skip: !GEMINI_KEY ? "Missing GEMINI_API_KEY: Tests are skipped" : false },
  () => {
    const aiAdapter = new AIAdapter();

    const assertQueryMatches = (
      query: UserRequest | string,
      startHour: number,
      endHour: number,
      campus: Campus,
      address?: string,
    ) => {
      assert.ok(
        typeof query !== "string",
        "Expected UserRequest object but received error string: " + query,
      );
      assert.ok(query.period, "Period should be defined");
      assert.strictEqual(
        query.period.start.getTime(),
        todayAt(startHour).getTime(),
        "Start time mismatch",
      );
      assert.strictEqual(
        query.period.end.getTime(),
        todayAt(endHour).getTime(),
        "End time mismatch",
      );
      assert.strictEqual(query.campus, campus, "Campus mismatch");
      if (address) {
        assert.strictEqual(query.address, address, "Address mismatch");
      }
    };

    it("should be defined", () => assert.ok(new AIAdapter()));

    it("should return an AvailabilityQuery", async () => {
      const userInput = [`I need a room in Rimini today, from 14 to 16.`];
      const query = await aiAdapter.extractRequest(userInput);

      assertQueryMatches(query, 14, 16, Campus.RIMINI);
    });

    it("should understand the information contained in the user's query", async () => {
      const userInput = ["I need a room in Rimini today, from 14 to 16."];
      const query = await aiAdapter.extractRequest(userInput);

      assertQueryMatches(query, 14, 16, Campus.RIMINI);
    });

    it("should handle queries with an address", async () => {
      const userInput = [
        "I need a room in Cesena, at via dell'Università 50, today from 10 to 12.",
      ];
      const query = await aiAdapter.extractRequest(userInput);

      assertQueryMatches(
        query,
        10,
        12,
        Campus.CESENA,
        "via dell'Università 50",
      );
    });

    it("should understand request made on multiple messages", async () => {
      const userInput = [
        "I need a room in Cesena, at via dell'Università 50, today from 10 to 12.",
        "Forget it! Search it from 13 to 15",
      ];
      const query = await aiAdapter.extractRequest(userInput);

      assertQueryMatches(
        query,
        13,
        15,
        Campus.CESENA,
        "via dell'Università 50",
      );
    });

    it("should combine multiple slots to cover the requested period", async () => {
      const userInput = ["I need a room in Rimini today, from 14 to 16."];
      const availableSlots: AvailableRoom[] = [
        new AvailableRoom(
          "room1",
          "classroom",
          "Rimini",
          todayAt(13),
          todayAt(15),
        ),
        new AvailableRoom(
          "room2",
          "classroom",
          "Rimini",
          todayAt(15),
          todayAt(18),
        ),
      ];
      const suggestion = await aiAdapter.getSuggestion(
        userInput,
        availableSlots,
      );
      assert.ok(suggestion);
      assert.strictEqual(suggestion.plan.slots.length, 2);

      const [firstStep, secondStep] = suggestion.plan.slots;
      assert.ok(firstStep);
      assert.ok(secondStep);
      assert.strictEqual(firstStep.roomId, "room1");
      assert.strictEqual(
        firstStep.period.start.getTime(),
        todayAt(14).getTime(),
      );
      assert.strictEqual(firstStep.period.end.getTime(), todayAt(15).getTime());
      assert.strictEqual(secondStep.roomId, "room2");
      assert.strictEqual(
        secondStep.period.start.getTime(),
        todayAt(15).getTime(),
      );
      assert.strictEqual(
        secondStep.period.end.getTime(),
        todayAt(16).getTime(),
      );
    });
  },
);
