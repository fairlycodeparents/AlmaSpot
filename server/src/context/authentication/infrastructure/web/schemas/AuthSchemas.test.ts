import { describe, it } from "node:test";
import assert from "node:assert";
import { loginSchema, signUpSchema } from "./AuthSchemas";

describe("AuthSchemas Integration Tests", () => {
  // Test SignUp

  describe("SignUp Schema", () => {
    it("dovrebbe accettare un utente con mail unibo e password", () => {
      const validData = { email: "admin@unibo.it", password: "Password1" };
      const result = signUpSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    it("dovrebbe fallire se manca l'email", () => {
      const result = signUpSchema.safeParse({ password: "Password1" });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "L'email è obbligatoria",
        );
      }
    });

    it("dovrebbe fallire se l'email non è valida", () => {
      const result = signUpSchema.safeParse({
        email: "admin.it",
        password: "Password1",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Devi inserire un indirizzo email valido",
        );
      }
    });

    it("dovrebbe fallire se l'email non è @unibo.it", () => {
      const result = signUpSchema.safeParse({
        email: "admin@gmail.com",
        password: "Password1",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Puoi registrarti solo con la mail istituzionale",
        );
      }
    });

    it("dovrebbe fallire se la password è troppo corta", () => {
      const result = signUpSchema.safeParse({
        email: "admin@unibo.it",
        password: "Pass1",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().password?._errors[0],
          "La password deve essere di almeno 8 caratteri",
        );
      }
    });

    it("dovrebbe fallire se la password è troppo lunga", () => {
      const longPassword = "a".repeat(101);
      const result = signUpSchema.safeParse({
        email: "admin@unibo.it",
        password: longPassword,
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().password?._errors[0],
          "La password è troppo lunga",
        );
      }
    });

    it("dovrebbe fallire se la password non ha numeri", () => {
      const result = signUpSchema.safeParse({
        email: "admin@unibo.it",
        password: "abc",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().password?._errors[0],
          "La password deve essere di almeno 8 caratteri",
        );
        const errors = result.error.format().password?._errors || [];
        assert.ok(
          errors.includes("La password deve contenere almeno un numero"),
        );
      }
    });
  });

  // Test Login

  describe("Login Schema", () => {
    it("dovrebbe accettare dati validi", () => {
      const result = loginSchema.safeParse({
        email: "admin@unibo.it",
        password: "Password1",
      });
      assert.strictEqual(result.success, true);
    });

    it("dovrebbe fallire se manca l'email", () => {
      const result = loginSchema.safeParse({ password: "Password1" });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "L'email è obbligatoria",
        );
      }
    });

    it("dovrebbe fallire se l'email non è valida", () => {
      const result = loginSchema.safeParse({
        email: "admin.it",
        password: "password",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(
          result.error.format().email?._errors[0],
          "Formato email non valido",
        );
      }
    });
  });
});
