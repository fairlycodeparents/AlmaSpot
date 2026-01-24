import { Request, Response } from "express";
import { NotificationService } from "../../../application/NotificationService";
import { Plan } from "../../../../../shared/domain/Plan";
import { DeliveryDetails } from "../../../domain/ports/SubscriptionRepository";

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  async subscribe(req: Request, res: Response) {
    try {
      const { subscription, details } = req.body;
      if (!subscription || !details) {
        return res
          .status(400)
          .json({ error: "Missing subscription or details" });
      }
      if (!details.keys?.p256dh || !details.keys?.auth) {
        return res.status(400).json({ error: "Missing Encryption Keys" });
      }
      const studentId = subscription.studentId;
      const domainPlan = Plan.fromPrimitives(subscription.plan.slots);
      const deliveryDetails: DeliveryDetails = {
        type: "WEB_PUSH",
        endpoint: details.endpoint,
        keys: details.keys,
      };
      await this.service.subscribe(studentId, domainPlan, deliveryDetails);
      return res.status(201).send();
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes("Invalid")) {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).send();
    }
  }

  async unsubscribe(req: Request, res: Response) {
    try {
      const { studentId } = req.body;
      if (!studentId) {
        return res.status(400).json({ error: "Missing studentId" });
      }
      await this.service.unsubscribe(studentId);
      return res.status(200).send();
    } catch (e: any) {
      console.error("Unsubscribe error:", e);
      return res.status(500).send();
    }
  }
}
