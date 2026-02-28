import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation
const validate = [
  body("quickStartPlanId")
    .trim()
    .isUUID()
    .withMessage("QuickStartPlanId must be a uuid"),
];

// Create QuickPlanUser - enroll user in a quick start plan
interface CreateQuickPlanUserRequest extends Request {
  body: {
    quickStartPlanId: string;
  };
}

const createQuickPlanUserHandler = async (
  req: CreateQuickPlanUserRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userId = req.user!.id;
  const { quickStartPlanId } = req.body;

  try {
    const plan = await prisma.quickStartPlan.findUnique({
      where: { id: quickStartPlanId },
    });

    if (!plan) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const enrollmentExists = await prisma.quickPlanUser.findUnique({
      where: { userId_quickStartPlanId: { userId, quickStartPlanId } },
    });

    if (enrollmentExists) {
      res.status(400).json({ error: "You are already enrolled in this plan" });
      return;
    }

    const enrollment = await prisma.quickPlanUser.create({
      data: { userId, quickStartPlanId },
    });

    res
      .status(201)
      .json({ message: "Enrolled in plan successfully", enrollment });
  } catch (error) {
    console.error("Error enrolling in quick start plan:", error);
    res.status(500).json({ error: "Failed to enroll in quick start plan" });
  }
};

export const createQuickPlanUser = [...validate, createQuickPlanUserHandler];
