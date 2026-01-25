import { describe, it } from "node:test";
import assert from "node:assert";
import { RoomAvailabilityAdapter } from "./RoomAvailabilityAdapter";
import { AvailableRoom, UserRequest } from "context/search/domain/Entities";
import { Period } from "shared/domain/Period";
import { Campus } from "shared/domain/Location";
import { CoreFacade } from "context/core";

const createCore = (response: any[] = []): Partial<CoreFacade> => ({
  findAvailableRoomsBySite: async () => response,
  findAvailableRoomsByCampus: async () => response,
});

describe("RoomAvailabilityAdapter", () => {
  const period = new Period(
    new Date("2024-01-01T10:00:00"),
    new Date("2024-01-01T12:00:00"),
  );

  it("should use site-specific search when address is provided; otherwise, use campus-wide search", async () => {
    let methodCalled = "";
    const trackingCore: Partial<CoreFacade> = {
      findAvailableRoomsBySite: async () => {
        methodCalled += "site";
        return [];
      },
      findAvailableRoomsByCampus: async () => {
        methodCalled += "campus";
        return [];
      },
    };
    const adapter = new RoomAvailabilityAdapter(trackingCore as CoreFacade);
    await adapter.getAvailableRooms(
      new UserRequest(period, Campus.RIMINI, "Via Roma"),
    );
    methodCalled += "-";
    await adapter.getAvailableRooms(new UserRequest(period, Campus.RIMINI));
    assert.strictEqual(methodCalled, "site-campus");
  });

  it("should map core response to RoomAvailable objects correctly", async () => {
    const rawCoreResponse = [
      {
        room: {
          id: "R1",
          name: "Room 1",
          type: "Lab",
          campus: Campus.CESENA,
          site: { address: "Via Verdi" },
        },
        availableSlots: [{ period: { start: period.start, end: period.end } }],
      },
    ];
    const adapter = new RoomAvailabilityAdapter(
      createCore(rawCoreResponse) as CoreFacade,
    );
    const query = new UserRequest(period, Campus.CESENA);
    const result = await adapter.getAvailableRooms(query);
    assert.deepStrictEqual(result, [
      new AvailableRoom(
        "R1",
        "Room 1",
        "Lab",
        Campus.CESENA,
        "Via Verdi",
        period.start,
        period.end,
      ),
    ]);
  });

  it("should return empty list when core returns no matches", async () => {
    const adapter = new RoomAvailabilityAdapter(createCore() as CoreFacade);
    const query = new UserRequest(period, Campus.BOLOGNA);
    const result = await adapter.getAvailableRooms(query);
    assert.deepStrictEqual(result, []);
  });
});
