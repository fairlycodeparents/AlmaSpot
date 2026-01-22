import { NextFunction, Request, Response } from "express";
import { CoreFacade } from "../../application/CoreFacade";
import { CreateActivityDTO } from "../../application/dtos/ActivityDTO";

export class CoreController {
  constructor(private facade: CoreFacade) {}

  getCampuses = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const campuses = this.facade.getCampuses();
      res.json(campuses);
    } catch (error) {
      next(error);
    }
  };

  getSites = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { campus } = _req.query;

      if (!campus || typeof campus !== "string") {
        res.status(400).json({ error: "Campus parameter is required" });
        return;
      }

      const sites = await this.facade.getSites(campus);
      res.json(sites);
    } catch (error) {
      next(error);
    }
  };

  findExactFreeRooms = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { campus, start, end } = req.query;

      if (!campus || !start || !end) {
        res
          .status(400)
          .json({ error: "Missing required query params: campus, start, end" });
        return;
      }

      const rooms = await this.facade.findExactlyAvailableRooms(
        campus as string,
        new Date(start as string),
        new Date(end as string),
      );

      res.json(rooms);
    } catch (error) {
      next(error);
    }
  };

  findFreeRoomsByCampus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { campus, start, end } = req.query;

      if (!campus || !start || !end) {
        res
          .status(400)
          .json({ error: "Missing required query params: campus, start, end" });
        return;
      }

      const rooms = await this.facade.findAvailableRoomsByCampus(
        campus as string,
        new Date(start as string),
        new Date(end as string),
      );

      res.json(rooms);
    } catch (error) {
      next(error);
    }
  };

  findFreeRoomsBySite = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { campus, address, start, end } = req.query;

      if (!campus || !address || !start || !end) {
        res.status(400).json({
          error: "Missing required params: campus, address, start, end",
        });
        return;
      }

      const rooms = await this.facade.findAvailableRoomsBySite(
        campus as string,
        address as string,
        new Date(start as string),
        new Date(end as string),
      );

      res.json(rooms);
    } catch (error) {
      next(error);
    }
  };

  getActivities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { campus, date } = req.query;

      if (!campus || !date) {
        res
          .status(400)
          .json({ error: "Missing required query params: campus, date" });
        return;
      }

      const activities = await this.facade.getActivitiesByDate(
        campus as string,
        new Date(date as string),
      );
      res.json(activities);
    } catch (error) {
      next(error);
    }
  };

  createExternalActivity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Unauthorized: Missing token" });
        return;
      }

      const dto = req.body as CreateActivityDTO;
      dto.id = this.generateExternalActivityId(
        dto.title,
        new Date(dto.startTime),
      );

      if (
        !dto.roomId ||
        !dto.title ||
        !dto.startTime ||
        !dto.endTime ||
        !dto.campus ||
        !dto.site
      ) {
        res.status(400).json({
          error:
            "Invalid body: " +
            "missing required fields (roomId, title, startTime, endTime, campus, site)",
        });
        return;
      }

      dto.startTime = new Date(dto.startTime);
      dto.endTime = new Date(dto.endTime);

      await this.facade.createExternalActivity(token, dto);
      res.status(201).json({ message: "Activity created successfully" });
    } catch (error) {
      next(error);
    }
  };

  deleteExternalActivity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      await this.facade.deleteExternalActivity(token, id);
      res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  private generateExternalActivityId(activityId: string, start: Date): string {
    const dateStr = start.toISOString().slice(0, 10).replace(/-/g, ""); // 20241025
    const timeStr = start.toISOString().slice(11, 16).replace(/:/g, ""); // 0930

    return `ext-${activityId}-${dateStr}-${timeStr}`;
  }
}
