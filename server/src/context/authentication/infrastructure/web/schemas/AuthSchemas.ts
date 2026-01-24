import { z } from "zod";
import { LoginDto, SignUpDto } from "../../../application/dtos/AuthDtos";

export const loginSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),

    password: z.string({ message: "Password is required" }),
  })
  .strict() satisfies z.ZodType<LoginDto>;

export const signUpSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format")
      .endsWith("@unibo.it", {
        message: "Email must be a unibo.it address",
      }),

    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password too long")
      .regex(/\d/, "Password must contain at least one number"),
  })
  .strict() satisfies z.ZodType<SignUpDto>;
