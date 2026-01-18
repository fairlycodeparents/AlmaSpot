import { Request, Response, NextFunction } from "express";
import { SearchUseCase } from "../../domain/InboundPorts";
import { SearchRequestDTO } from "../../application/DTOs";

/** Controller for handling search requests. */
export class SearchController {
  /**
   * Constructor for `SearchController`.
   * @param useCase - An instance of `SearchUseCase` to handle search logic.
   */
  constructor(private useCase: SearchUseCase) {}

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
      const suggestion = await this.useCase.search(request);

      res.json(suggestion);
    } catch (error) {
      next(error);
    }
  }
}
