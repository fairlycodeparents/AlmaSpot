import { describe, it } from "node:test";
import assert from "node:assert";
import { Period } from "./Period";

describe("Period Value Object Test", () => {
  const d = (h: number) =>
    new Date(`2026-03-20T${h.toString().padStart(2, "0")}:00:00`);

  it("Overlaps: TRUE se c'è sovrapposizione parziale", () => {
    const p1 = new Period(d(10), d(12));
    const p2 = new Period(d(11), d(13));
    assert.strictEqual(p1.overlaps(p2), true);
  });

  it("Overlaps: TRUE se uno contiene l'altro", () => {
    const big = new Period(d(9), d(13));
    const small = new Period(d(10), d(11));
    assert.strictEqual(big.overlaps(small), true);
    assert.strictEqual(small.overlaps(big), true);
  });

  it("Overlaps: FALSE se sono adiacenti (inizio di uno coincide con fine dell'altro)", () => {
    const p1 = new Period(d(10), d(11));
    const p2 = new Period(d(11), d(12));

    assert.strictEqual(p1.overlaps(p2), false);
  });

  it("Constructor: Dovrebbe lanciare errore se Start > End", () => {
    try {
      new Period(d(12), d(10));
      assert.fail("Non dovrebbe permettere start > end");
    } catch (e) {
      assert.ok(e);
    }
  });
});
