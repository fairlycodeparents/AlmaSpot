import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoAdminRepository } from "./MongoAdminRepository";
import { Administrator } from "../../../domain/model/Administrator";
import { AdminModel } from "./MongoAdminSchema";
import { env } from "../../../../../shared/config/env";

describe("MongoAdminRepository Test", () => {
  let repo: MongoAdminRepository;

  before(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(env.MONGO_URI, {
      dbName: "almaspot_test",
    });
    repo = new MongoAdminRepository();
  });

  beforeEach(async () => {
    await AdminModel.deleteMany({});
    await AdminModel.syncIndexes();
  });

  after(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });

  it("save and findByEmail: should create an admin and found it by email", async () => {
    const email = "admin@unibo.com";
    const passwordHash = "$argon2id$test_hash";
    const originalId = "uuid-1";

    const admin = new Administrator(email, passwordHash, originalId);

    await repo.save(admin);
    const foundAdmin = await repo.findByEmail(email);

    assert.ok(foundAdmin, "Admin should exist in DB");
    assert.strictEqual(foundAdmin?.email, email);
    assert.strictEqual(foundAdmin?.hashedPassword, passwordHash);
    assert.strictEqual(foundAdmin?.id, originalId);
  });

  it("findByEmail: should return null if email doesn't exist", async () => {
    const found = await repo.findByEmail("nonEsiste@test.it");
    assert.strictEqual(found, null);
  });

  it("save: should throw an error if we create an admin with an email already in use", async () => {
    const admin1 = new Administrator("admin@unibo.com", "hash1", "uuid-1");
    const admin2 = new Administrator("admin@unibo.com", "hash2", "uuid-2");

    await repo.save(admin1);

    await assert.rejects(async () => {
      await repo.save(admin2);
    });
  });
});
