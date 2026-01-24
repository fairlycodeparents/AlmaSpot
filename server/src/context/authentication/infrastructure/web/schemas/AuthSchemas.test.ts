import { describe, it } from "node:test";
import assert from "node:assert";
import { loginSchema, signUpSchema } from "./AuthSchemas";

describe("AuthSchemas Tests", () => {
  describe("SignUp Schema", () => {
    it("safeParse: should accept an user with unibo email and password", () => {
      const validData = { email: "admin@unibo.it", password: "Password1" };
      const result = signUpSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    it("safeParse: should fail if email missing", () => {
      const result = signUpSchema.safeParse({ password: "Password1" });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Email is required",
        );
      }
    });

    it("safeParse: should fail with invalid email", () => {
      const result = signUpSchema.safeParse({
        email: "admin.it",
        password: "Password1",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Invalid email format",
        );
      }
    });

    it("safeParse: should fail if email domain not unibo.it", () => {
      const result = signUpSchema.safeParse({
        email: "admin@gmail.com",
        password: "Password1",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Email must be a unibo.it address",
        );
      }
    });

    it("safeParse: should fail if password too short", () => {
      const result = signUpSchema.safeParse({
        email: "admin@unibo.it",
        password: "Pass1",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().password?._errors[0],
          "Password must be at least 8 characters long",
        );
      }
    });

    it("safeParse: should fail if password too long", () => {
      const longPassword = "a".repeat(101);
      const result = signUpSchema.safeParse({
        email: "admin@unibo.it",
        password: longPassword,
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().password?._errors[0],
          "Password too long",
        );
      }
    });

    it("safeParse: should fail if password doesn't contain numbers", () => {
      const result = signUpSchema.safeParse({
        email: "admin@unibo.it",
        password: "abc",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().password?._errors[0],
          "Password must be at least 8 characters long",
        );
        const errors = result.error.format().password?._errors || [];
        assert.ok(errors.includes("Password must contain at least one number"));
      }
    });
  });

  describe("Login Schema", () => {
    it("safeParse: should accept valid data", () => {
      const result = loginSchema.safeParse({
        email: "admin@unibo.it",
        password: "Password1",
      });
      assert.strictEqual(result.success, true);
    });

    it("safeParse: should fail if email missing", () => {
      const result = loginSchema.safeParse({ password: "Password1" });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Email is required",
        );
      }
    });

    it("safeParse: should fail if email invalid", () => {
      const result = loginSchema.safeParse({
        email: "admin.it",
        password: "password",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Invalid email format",
        );
      }
    });
  });
});
