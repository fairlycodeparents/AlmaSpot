import { Request, Response } from "express";
import { NotificationService } from "../../../application/NotificationService";
import { Plan } from "../../../../../shared/domain/Plan";
import { DeliveryDetails } from "../../../domain/ports/SubscriptionRepository";

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  async subscribe(req: Request, res: Response) {
    try {
      const { subscription, plan } = req.body;
      if (!subscription || !subscription.endpoint || !plan) {
        return res.status(400).json({ error: "Missing subscription or plan" });
      }
      if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
        return res.status(400).json({ error: "Missing Encryption Keys" });
      }
      const studentId = subscription.endpoint;
      const domainPlan = Plan.fromPrimitives(plan);
      const deliveryDetails: DeliveryDetails = {
        type: "WEB_PUSH",
        endpoint: subscription.endpoint,
        keys: subscription.keys,
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
}
