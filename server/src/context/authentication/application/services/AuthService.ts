import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";
import type { AdminRepository } from "../../domain/ports/AdminRepository";
import { Administrator } from "../../domain/model/Administrator";
import { AuthInputPort } from "../ports/AuthInputPort";
import { env } from "../../../../shared/config/env";

export class AuthService implements AuthInputPort {
  private readonly JWT_SECRET = env.JWT_SECRET;

  private readonly HASH_CONFIG = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  };

  constructor(private readonly repo: AdminRepository) {}

  async signUp(email: string, password: string): Promise<void> {
    const existingUser = await this.repo.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await argon2.hash(password, this.HASH_CONFIG);
    const newAdmin = new Administrator(email, hashedPassword, uuid4());
    await this.repo.save(newAdmin);
  }

  async login(email: string, password: string): Promise<string> {
    const admin = await this.repo.findByEmail(email);
    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await argon2.verify(admin.hashedPassword, password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        sub: admin.id,
        email: admin.email,
        role: "admin",
      },
      this.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
    );

    return token;
  }

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
}
