import { Request, Response, NextFunction } from "express";
import { SearchPlanService } from "../../application/SearchPlanService";
import { SearchRequestDTO } from "../../application/DTOs";

/** Controller for handling search requests. */
export class SearchController {
  /**
   * Creates an instance of SearchController.
   * @param service - The search plan service to handle search logic.
   */
  constructor(private service: SearchPlanService) {}

  /**
   * Handles search requests.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function.
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { userMessages } = req.body;

      if (
        !userMessages ||
        !Array.isArray(userMessages) ||
        userMessages.length === 0
      ) {
        res.status(400).json({
          error:
            "Invalid request body: userMessages must be a non-empty array.",
        });
        return;
      }

      const request: SearchRequestDTO = { userMessages };
      const suggestion = await this.service.search(request);

      res.json(suggestion);
    } catch (error) {
      next(error);
    }
  }
}
