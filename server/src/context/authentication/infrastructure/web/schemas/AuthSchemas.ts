import { z } from "zod";
import { LoginDto, SignUpDto } from "../../../application/dtos/AuthDtos";

export const loginSchema = z
  .object({
    email: z
      .string({ message: "L'email è obbligatoria" })
      .email("Formato email non valido"),

    password: z.string({ message: "La password è obbligatoria" }),
  })
  .strict() satisfies z.ZodType<LoginDto>;

export const signUpSchema = z
  .object({
    email: z
      .string({ message: "L'email è obbligatoria" })
      .email("Devi inserire un indirizzo email valido")
      .endsWith("@unibo.it", {
        message: "Puoi registrarti solo con la mail istituzionale",
      }),

    password: z
      .string({ message: "La password è obbligatoria" })
      .min(8, "La password deve essere di almeno 8 caratteri")
      .max(100, "La password è troppo lunga")
      .regex(/\d/, "La password deve contenere almeno un numero"),
  })
  .strict() satisfies z.ZodType<SignUpDto>;
