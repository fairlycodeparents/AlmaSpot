import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET TROPPO CORTA! Deve essere di almeno 32 caratteri"),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("ERRORE NELLE VARIABILI D'AMBIENTE:");
  console.error(_env.error.format());

  process.exit(1);
}

export const env = _env.data;
