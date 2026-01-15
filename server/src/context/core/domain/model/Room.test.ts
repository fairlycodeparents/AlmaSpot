import { describe, it } from "node:test";
import assert from "node:assert";
import { Room, RoomType } from "./Room";
import { Campus, Site } from "../../../../shared/domain/Location";
import { Period } from "../../../../shared/domain/Period";
import { Activity } from "./Activity";

describe("Room Entity Unit Test", () => {
  const site = new Site(Campus.CESENA, "Via X");
  const room = new Room(
    "R1",
    "Room 1",
    RoomType.CLASSROOM,
    Campus.CESENA,
    site,
  );

  const d = (h: number) =>
    new Date(`2026-03-20T${h.toString().padStart(2, "0")}:00:00`);

  it("isFreeInPeriod: TRUE se non ci sono attività", () => {
    const period = new Period(d(9), d(11));
    assert.strictEqual(room.isFreeInPeriod(period, []), true);
  });

  it("isFreeInPeriod: FALSE se c'è sovrapposizione", () => {
    const searchPeriod = new Period(d(10), d(12));

    const busyActivity = {
      period: new Period(d(9), d(11)),
    } as Activity;

    assert.strictEqual(
      room.isFreeInPeriod(searchPeriod, [busyActivity]),
      false,
    );
  });

  it("isFreeInPeriod: TRUE se l'attività finisce esattamente quando inizia la ricerca", () => {
    const searchPeriod = new Period(d(11), d(13));

    const previousActivity = {
      period: new Period(d(9), d(11)),
    } as Activity;

    assert.strictEqual(
      room.isFreeInPeriod(searchPeriod, [previousActivity]),
      true,
    );
  });
});
