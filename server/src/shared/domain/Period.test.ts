import { describe, it } from "node:test";
import assert from "node:assert";
import { Period } from "./Period";

describe("Period Value Object Test", () => {
  const d = (h: number) =>
    new Date(`2026-03-20T${h.toString().padStart(2, "0")}:00:00`);

  it("overlaps: should return true if partially overlaps", () => {
    const p1 = new Period(d(10), d(12));
    const p2 = new Period(d(11), d(13));
    assert.strictEqual(p1.overlaps(p2), true);
  });

  it("overlaps: should return true if one contain the other", () => {
    const big = new Period(d(9), d(13));
    const small = new Period(d(10), d(11));
    assert.strictEqual(big.overlaps(small), true);
    assert.strictEqual(small.overlaps(big), true);
  });

  it("overlaps: should return false if contiguous", () => {
    const p1 = new Period(d(10), d(11));
    const p2 = new Period(d(11), d(12));

    assert.strictEqual(p1.overlaps(p2), false);
  });

  it("constructor: should throw an error if start > end", () => {
    try {
      new Period(d(12), d(10));
      assert.fail("Shouldn't accept invalid period");
    } catch (e) {
      assert.ok(e);
    }
  });
});
