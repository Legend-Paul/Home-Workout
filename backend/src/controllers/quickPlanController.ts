import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("name").isString().withMessage("Name must be a string"),
  body("goal")
    .isIn(["BUILD_MUSCLE", "LOSE_FAT", "MAINTAIN_FITNESS", "OTHER"])
    .withMessage("Goal must be a string"),
  body("level")
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"])
    .withMessage("Level must be a string"),
  body("dayOfWeek").isNumeric().withMessage("Day of week must be a number"),
  body("dayName").isString().withMessage("Day name must be a string"),
  body("isRestDay").isBoolean().withMessage("isRestDay must be a boolean"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
];

// Create createQuickStartPlan handler
interface QuickPlanRequest extends Request {
  body: {
    name: string;
    goal: "BUILD_MUSCLE" | "LOSE_FAT" | "MAINTAIN_FITNESS" | "OTHER";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
    dayOfWeek: number;
    dayName: string;
    isRestDay: boolean;
    isActive: boolean;
  };
}

const createQuickPlanHandler = async (
  req: QuickPlanRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, goal, level, dayOfWeek, dayName, isRestDay, isActive } =
    req.body;

  try {
    const newQuickStartPlan = await prisma.quickStartPlan.create({
      data: {
        name,
        goal,
        level,
        dayOfWeek,
        dayName,
        isRestDay,
        isActive,
      },
    });
    res.status(201).json(newQuickStartPlan);
  } catch (error) {
    console.error("Error creating quick start plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const createQuickPlan = [...validate, createQuickPlanHandler];
