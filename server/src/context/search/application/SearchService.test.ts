import { describe, it } from "node:test";
import assert from "node:assert";
import { SearchService } from "./SearchService";
import { AI, RoomAvailability } from "./ports/OutboundPorts";
import { ChatMessageDTO, SearchRequestDTO, SuggestionDTO } from "./DTOs";
import { UserRequest, RoomSlot } from "../domain/Entities";
import { Period } from "shared/domain/Period";
import { Campus } from "shared/domain/Location";

describe("SearchService", () => {
  it("must execute steps in strict sequence: extract -> availability -> suggestion", async () => {
    const messages = [
      {
        role: "user",
        content: "I need a room for a study session.",
      },
    ] as ChatMessageDTO[];

    const request: SearchRequestDTO = { history: messages };
    const now = new Date();
    const start = new Date(now.setHours(1));
    const end = new Date(now.setHours(2));
    const period = new Period(start, end);
    const expectedRequest = new UserRequest(period, Campus.CESENA);
    const expectedRooms = [
      new RoomSlot("1", "Room 1", "Lab", Campus.RIMINI, "Via X", start, end),
    ];

    const expectedSuggestion: SuggestionDTO = {
      plan: [],
      response: "Here is a suggested plan.",
    };

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
    assert.deepStrictEqual(result, expectedSuggestion);
  });
});
