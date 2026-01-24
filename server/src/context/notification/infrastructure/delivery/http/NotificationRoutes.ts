import { Router } from "express";
import { NotificationController } from "./NotificationController";

export class NotificationRoutes {
  private router = Router();

  constructor(private readonly controller: NotificationController) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/subscribe", (req, res) =>
      this.controller.subscribe(req, res),
    );
    this.router.post("/unsubscribe", (req, res) =>
      this.controller.unsubscribe(req, res),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
