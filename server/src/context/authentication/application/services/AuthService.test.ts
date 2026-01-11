import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AuthService } from "./AuthService";
import { InMemoryAdminRepository } from "../../infrastructure/repositories/InMemoryAdminRepository";

describe("AuthService", () => {
  let authService: AuthService;
  let adminRepo: InMemoryAdminRepository;

  beforeEach(() => {
    adminRepo = new InMemoryAdminRepository();
    authService = new AuthService(adminRepo);
  });

  // Test SignUp

  it("dovrebbe registrare un utente correttamente e hashare la password", async () => {
    const email = "admin.prova@unibo.it";
    const password = "Password1";

    await authService.signUp(email, password);

    const savedUser = await adminRepo.findByEmail(email);
    assert.ok(savedUser, "L'utente dovrebbe esistere nel DB");

    assert.notStrictEqual(
      savedUser?.hashedPassword,
      password,
      "La password deve essere hashata",
    );
    assert.strictEqual(savedUser?.email, email);
  });

  it("dovrebbe impedire la registrazione se l'email esiste già", async () => {
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

  // Test Login

  it("dovrebbe restituire un token JWT se le credenziali sono corrette", async () => {
    const email = "admin.prova@unibo.it";
    const password = "Password1";

    await authService.signUp(email, password);

    const token = await authService.login(email, password);

    assert.ok(token);
    assert.strictEqual(typeof token, "string");
    assert.strictEqual(token.split(".").length, 3);
  });

  it("dovrebbe fallire il login se l'utente non esiste", async () => {
    await assert.rejects(
      async () => {
        await authService.login("nonesiste@unibo.it", "Password1");
      },
      { message: "Invalid credentials" },
    );
  });

  it("dovrebbe fallire il login se la password è sbagliata", async () => {
    const email = "admin.prova@unibo.it";
    await authService.signUp(email, "PasswordGiusta");

    await assert.rejects(
      async () => {
        await authService.login(email, "PasswordSbagliata");
      },
      { message: "Invalid credentials" },
    );
  });

  // Test Token

  it("dovrebbe verificare un token valido", async () => {
    await authService.signUp("token@test.it", "pass");
    const token = await authService.login("token@test.it", "pass");

    const isValid = authService.verifyToken(token);
    assert.strictEqual(isValid, true);
  });

  it("dovrebbe rifiutare un token manipolato", async () => {
    const fakeToken = "header.payload.signature_falsa";
    const isValid = authService.verifyToken(fakeToken);
    assert.strictEqual(isValid, false);
  });
});
