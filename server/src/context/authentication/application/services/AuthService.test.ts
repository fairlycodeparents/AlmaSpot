import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AuthService } from "./AuthService";
import { InMemoryAdminRepository } from "../../infrastructure/persistence/in-memory/InMemoryAdminRepository";

describe("AuthService", () => {
  let authService: AuthService;
  let adminRepo: InMemoryAdminRepository;

  beforeEach(() => {
    adminRepo = new InMemoryAdminRepository();
    authService = new AuthService(adminRepo);
  });

  it("signUp: should register any new user correctly and hash password", async () => {
    const email = "admin.prova@unibo.it";
    const password = "Password1";

    await authService.signUp(email, password);

    const savedUser = await adminRepo.findByEmail(email);
    assert.ok(savedUser, "User should exist in the repository");

    assert.notStrictEqual(
      savedUser?.hashedPassword,
      password,
      "Password should be hashed",
    );
    assert.strictEqual(savedUser?.email, email);
  });

  it("signUp: should fail if email already taken", async () => {
    const email = "admin.prova@unibo.it";

    await authService.signUp(email, "Password1");

    await assert.rejects(
      async () => {
        await authService.signUp(email, "Password2");
      },
      (err: any) => {
        assert.strictEqual(err.message, "User already exists");
        return true;
      },
    );
  });

  it("login: should return JWT token if credentials are correct", async () => {
    const email = "admin.prova@unibo.it";
    const password = "Password1";

    await authService.signUp(email, password);

    const token = await authService.login(email, password);

    assert.ok(token);
    assert.strictEqual(typeof token, "string");
    assert.strictEqual(token.split(".").length, 3);
  });

  it("login: should fail if user doesn't exist", async () => {
    await assert.rejects(
      async () => {
        await authService.login("nonesiste@unibo.it", "Password1");
      },
      { message: "Invalid credentials" },
    );
  });

  it("login: should fail if password is incorrect", async () => {
    const email = "admin.prova@unibo.it";
    await authService.signUp(email, "PasswordGiusta");

    await assert.rejects(
      async () => {
        await authService.login(email, "PasswordSbagliata");
      },
      { message: "Invalid credentials" },
    );
  });

  it("verifyToken: should verify token validity", async () => {
    await authService.signUp("token@test.it", "pass");
    const token = await authService.login("token@test.it", "pass");

    const isValid = authService.verifyToken(token);
    assert.strictEqual(isValid, true);
  });

  it("verifyToken: should block compromised token", async () => {
    const fakeToken = "header.payload.signature_falsa";
    const isValid = authService.verifyToken(fakeToken);
    assert.strictEqual(isValid, false);
  });
});
