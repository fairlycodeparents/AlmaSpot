import { describe, it } from "node:test";
import assert from "node:assert";
import { SearchService } from "./SearchService";
import { AI, RoomAvailability } from "./OutboundPorts";
import { SearchRequestDTO } from "./DTOs";
import { UserRequest, AvailableRoom, Suggestion } from "../domain/Entities";
import { Period } from "shared/domain/Period";
import { Campus } from "shared/domain/Location";
import { Plan } from "shared/domain/Plan";

describe("SearchPlanService", () => {
  it("must execute steps in strict sequence: extract -> availability -> suggestion", async () => {
    const messages = ["I need a room for a study session."];
    const request: SearchRequestDTO = { userMessages: messages };
    const now = new Date();
    const start = new Date(now.setHours(1));
    const end = new Date(now.setHours(2));
    const period = new Period(start, end);
    const expectedRequest = new UserRequest(period, Campus.CESENA);
    const expectedRooms = [new AvailableRoom("1", "Lab", "Via X", start, end)];
    const expectedSuggestion = new Suggestion(
      new Plan([]),
      "Here is a suggested plan.",
    );
    const executionOrder: string[] = [];

    const mockAI: AI = {
      extractRequest: async (msgs) => {
        executionOrder.push("extractRequest");
        assert.strictEqual(msgs, messages);
        return expectedRequest;
      },
      getSuggestion: async (msgs, rooms) => {
        executionOrder.push("getSuggestion");
        assert.strictEqual(msgs, messages);
        assert.strictEqual(rooms, expectedRooms);
        return expectedSuggestion;
      },
    };

    const mockAvailability: RoomAvailability = {
      getAvailableRooms: async (req) => {
        executionOrder.push("getAvailableRooms");
        assert.strictEqual(req, expectedRequest);
        return expectedRooms;
      },
    };

    const service = new SearchService(mockAI, mockAvailability);
    const result = await service.search(request);
    assert.deepStrictEqual(executionOrder, [
      "extractRequest",
      "getAvailableRooms",
      "getSuggestion",
    ]);
    assert.strictEqual(result, expectedSuggestion);
  });
});
