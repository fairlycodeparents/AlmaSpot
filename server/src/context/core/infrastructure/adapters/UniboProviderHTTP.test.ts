import { afterEach, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert";
import { UniboProviderHTTP } from "./UniboProviderHTTP";
import { Campus } from "../../../../shared/domain/Location";

describe("UniboProviderHTTP Test", () => {
  let provider: UniboProviderHTTP;

  const originalFetch = global.fetch;

  beforeEach(() => {
    provider = new UniboProviderHTTP();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetchInternalActivities: should parse JSON response correctly", async () => {
    const mockResponse = [
      {
        title: "Lezione di Prova",
        start: "2026-03-20T09:00:00.000Z",
        end: "2026-03-20T11:00:00.000Z",
        room_code: "AULA A",
        professors: ["Prof. X"],
        course_id: "8614",
      },
    ];

    global.fetch = mock.fn(
      async () =>
        ({
          ok: true,
          json: async () => mockResponse,
        }) as Response,
    );

    const result = await provider.fetchInternalActivities(
      Campus.CESENA,
      new Date("2026-03-20"),
    );

    assert.strictEqual(result.length, 1);
    assert.ok(result[0]);
    assert.strictEqual(result[0].id, "int-8614-aula-a-ce-20260320-0900");
    assert.strictEqual(result[0].title, "Lezione di Prova");
    assert.strictEqual(result[0].roomId, "aula-a-ce");

    assert.strictEqual(
      result[0].period.start.toISOString(),
      "2026-03-20T09:00:00.000Z",
    );
  });

  it("fetchInternalActivities: should throw an error if HTTP response not valid", async () => {
    global.fetch = mock.fn(
      async () =>
        ({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        }) as Response,
    );

    await assert.rejects(
      async () => {
        await provider.fetchInternalActivities(Campus.CESENA, new Date());
      },
      (err: any) => {
        return err.message.includes("Status: 500");
      },
    );
  });

  it("fetchInternalActivities: should manage network errors", async () => {
    global.fetch = mock.fn(async () => {
      throw new Error("Connection Refused");
    });

    await assert.rejects(async () => {
      await provider.fetchInternalActivities(Campus.CESENA, new Date());
    }, "[UniboProvider] Error while fetching data: Error: Connection Refused");
  });
});
