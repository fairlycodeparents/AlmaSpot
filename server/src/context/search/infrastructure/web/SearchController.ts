import { Request, Response, NextFunction } from "express";
import { SearchUseCase } from "../../application/ports/InboundPorts";
import { SearchRequestDTO } from "../../application/DTOs";
import { z } from "zod";

const searchSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        content: z.string().min(1, "Message content cannot be empty"),
      }),
    )
    .min(1, "History must contain at least one message"),
});

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
      const validation = searchSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          error:
            "Invalid body request format: history must be a non-empty array of chat messages with role and content fields.",
          details: validation.error,
        });
        return;
      }

      const request: SearchRequestDTO = {
        history: validation.data.history,
      };

      const suggestion = await this.useCase.search(request);

      res.status(200).json(suggestion);
    } catch (error) {
      next(error);
    }
  }
}
