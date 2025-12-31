import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("date").isDate().withMessage("Must be a valid date"),
  body("startTime")
    .isTime({ hourFormat: "hour24" })
    .withMessage("Start time must be  valid time"),
  body("endTime")
    .isTime({ hourFormat: "hour24" })
    .withMessage("End time must be  valid time"),
  body("timeUsed")
    .isNumeric()
    .custom((value) => value >= 0)
    .withMessage("Must be valid minutes"),
  body("status")
    .isIn(["PENDING", "SKIPPED", "COMPLETED", "REST"])
    .withMessage("Invalid status"),
  body("weeklyPlanId").isUUID().withMessage("Week plan id must be valid uuid"),
];

interface CalendarRequest extends Request {
  body: {
    date: Date;
    startTime: string;
    endTime: string;
    timeUsed: number;
    status: "PENDING" | "SKIPPED" | "COMPLETED" | "REST";
    weeklyPlanId: string;
  };
  params: {
    id: string;
  };
}

export const createNewCalendarEntry = [
  ...validate,
  async (req: CalendarRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { date, startTime, endTime, timeUsed, status, weeklyPlanId } =
      req.body;
    const { id } = req.params;
    try {
      const [userExist, weeklyPlanExist] = await Promise.all([
        prisma.user.findUnique({
          where: { id },
        }),
        prisma.weeklyPlan.findUnique({
          where: {
            id: weeklyPlanId,
          },
        }),
      ]);

      if (!userExist) {
        res.status(400).json({ error: "User not found!" });
        return;
      }
      if (!weeklyPlanExist) {
        res.status(400).json({ error: "Wekkly plan not found!" });
        return;
      }

      await prisma.calendarEntry.create({
        data: {
          date,
          startTime,
          endTime,
          timeUsed,
          status,
          weeklyPlanId,
          userId: id,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create calendar entry" });
    }
  },
];

export const getCalendarEntry = (req: CalendarRequest, res: Response) => {};
