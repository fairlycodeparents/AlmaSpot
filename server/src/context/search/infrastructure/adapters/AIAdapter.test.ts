import { describe, it } from "node:test";
import assert from "node:assert";

import { AIAdapter } from "./AIAdapter";
import { Campus } from "shared/domain/Location";

const GEMINI_KEY = process.env["GEMINI_API_KEY"];
const aiAdapter = new AIAdapter();

describe(
  "AI Adapter",
  { skip: !GEMINI_KEY ? "Missing GEMINI_API_KEY: Tests are skipped" : false },
  () => {
    it("should be defined", () => assert.ok(new AIAdapter()));

    it("should return an AvailabilityQuery", async () => {
      const userInput = ["I need a room in Rimini today, from 2 PM to 4 PM."];
      const query = await aiAdapter.getQueryGivenUserInput(userInput);
      assert.ok(query.period);
      assert.ok(query.campus);
    });

    it("should understand the information contained in the user's query", async () => {
      const userInput = ["I need a room in Rimini today, from 2 PM to 4 PM."];
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

      const now = new Date();
      const expectedStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        14,
        0,
        0,
      );
      const expectedEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        16,
        0,
        0,
      );

      assert.strictEqual(query.period.start.getTime(), expectedStart.getTime());
      assert.strictEqual(query.period.end.getTime(), expectedEnd.getTime());
      assert.strictEqual(query.campus, Campus.RIMINI);
    });

    it("should handle queries with an address", async () => {
      const userInput = [
        "I need a room in Cesena, at via dell'Università 50, today from 10 AM to 12 PM.",
      ];
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

      const now = new Date();
      const expectedStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        10,
        0,
        0,
      );
      const expectedEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12,
        0,
        0,
      );

      assert.strictEqual(query.period.start.getTime(), expectedStart.getTime());
      assert.strictEqual(query.period.end.getTime(), expectedEnd.getTime());
      assert.strictEqual(query.campus, Campus.CESENA);
      assert.strictEqual(query.address, "via dell'Università 50");
    });

    it("should understand request made on multiple messages", async () => {
      const userInput = [
        "I need a room in Cesena, at via dell'Università 50, today from 10 AM to 12 PM.",
        "Forget it! Search it from 1PM to 3PM",
      ];
      const query = await aiAdapter.getQueryGivenUserInput(userInput);

      const now = new Date();
      const expectedStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        13,
        0,
        0,
      );
      const expectedEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        15,
        0,
        0,
      );

      assert.strictEqual(query.period.start.getTime(), expectedStart.getTime());
      assert.strictEqual(query.period.end.getTime(), expectedEnd.getTime());
      assert.strictEqual(query.campus, Campus.CESENA);
      assert.strictEqual(query.address, "via dell'Università 50");
    });
  },
);
