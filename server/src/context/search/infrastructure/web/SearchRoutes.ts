import { Router } from "express";
import { SearchController } from "./SearchController";

/** Routes for handling search-related endpoints. */
export class SearchRoutes {
  private router = Router();

  /**
   * Creates an instance of SearchRoutes.
   * @param controller
   */
  constructor(private controller: SearchController) {
    this.initRoutes();
  }

  /** Initializes the search routes. */
  private initRoutes() {
    this.router.post("/", (req, res, next) =>
      this.controller.search(req, res, next),
    );
  }

  /** Gets the router with the defined routes. */
  getRouter() {
    return this.router;
  }
}
