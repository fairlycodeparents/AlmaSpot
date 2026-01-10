import { Router } from "express";
import { AuthController } from "./AuthController";

export const createAuthRouter = (controller: AuthController) => {
  const router = Router();

  router.post("/signup", (req, res) => controller.signUp(req, res));
  router.post("/login", (req, res) => controller.login(req, res));

  return router;
};
