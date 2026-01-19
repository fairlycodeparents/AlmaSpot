import { Router } from "express";
import { AuthController } from "./AuthController";

export class AuthRoutes {
  private router = Router();

  constructor(private readonly controller: AuthController) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/signup", (req, res) => this.controller.signUp(req, res));
    this.router.post("/login", (req, res) => this.controller.login(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
