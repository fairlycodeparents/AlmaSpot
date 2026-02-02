import { Router } from "express";
import { CoreController } from "./CoreController";

export class CoreRoutes {
  private router = Router();

  constructor(private controller: CoreController) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/metadata/campuses", this.controller.getCampuses);

    this.router.get("/metadata/sites", this.controller.getSites);

    this.router.get("/rooms/exact-free", this.controller.findExactFreeRooms);

    this.router.get(
      "/rooms/free-by-campus",
      this.controller.findFreeRoomsByCampus,
    );

    this.router.get("/rooms/free-by-site", this.controller.findFreeRoomsBySite);

    this.router.get("/rooms/find-by-id", this.controller.findRoomById);

    this.router.get("/activities", this.controller.getActivities);

    this.router.post(
      "/activities/external",
      this.controller.createExternalActivity,
    );

    this.router.delete(
      "/activities/external/:id",
      this.controller.deleteExternalActivity,
    );
  }

  getRouter() {
    return this.router;
  }
}
