import { Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";
import { signUpSchema, loginSchema } from "./schemas/AuthSchemas";

export class AuthController {
  constructor(private service: AuthService) {}

  async signUp(req: Request, res: Response) {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Dati non validi",
        errors: result.error.format(),
      });
    }

    try {
      const { email, password } = result.data;

      await this.service.signUp(email, password);
      return res.status(201).json({ message: "Registrato!" });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  async login(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.format(),
      });
    }

    try {
      const { email, password } = result.data;
      const token = await this.service.login(email, password);
      return res.status(200).json({ token });
    } catch (e: any) {
      return res.status(401).json({ error: e.message });
    }
  }
}
