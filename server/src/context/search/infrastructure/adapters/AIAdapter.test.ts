import { describe, it } from "node:test";
import assert from "node:assert";

import { AIAdapter } from "./AIAdapter";
import { Campus } from "shared/domain/Location";
import { AvailabilityQuery } from "context/search/domain/Entities";

const GEMINI_KEY = process.env["GEMINI_API_KEY"];
const todayAt = (hour: number) => new Date(new Date().setHours(hour, 0, 0, 0));

describe(
  "AI Adapter",
  { skip: !GEMINI_KEY ? "Missing GEMINI_API_KEY: Tests are skipped" : false },
  () => {
    const aiAdapter = new AIAdapter();

    const assertQueryMatches = (
      query: AvailabilityQuery,
      startHour: number,
      endHour: number,
      campus: Campus,
      address?: string,
    ) => {
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
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

      assertQueryMatches(query, 14, 16, Campus.RIMINI);
    });

    it("should understand the information contained in the user's query", async () => {
      const userInput = ["I need a room in Rimini today, from 14 to 16."];
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

      assertQueryMatches(query, 14, 16, Campus.RIMINI);
    });

    it("should handle queries with an address", async () => {
      const userInput = [
        "I need a room in Cesena, at via dell'Università 50, today from 10 to 12.",
      ];
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

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
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

      assertQueryMatches(
        query,
        13,
        15,
        Campus.CESENA,
        "via dell'Università 50",
      );
    });
  },
);
