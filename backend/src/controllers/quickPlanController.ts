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
  body("dayOfWeek")
    .isNumeric()
    .withMessage("Day of week must be a number")
    .custom((value) => value >= 0 && value <= 6)
    .withMessage("Day of week must be between 0 and 6"),
  body("muscleGroup")
    .isArray({ min: 1 })
    .withMessage("Muscle group must be an array"),
  body("dayName")
    .isIn([
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ])
    .withMessage("DayName must be a valid day of the week"),
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
    dayName:
      | "SUNDAY"
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY";
    muscleGroup: string[];
    isRestDay: boolean;
    isActive: boolean;
  };
  params: {
    id: string;
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

  const {
    name,
    goal,
    level,
    dayOfWeek,
    dayName,
    muscleGroup,
    isRestDay,
    isActive,
  } = req.body;

  try {
    const newQuickStartPlan = await prisma.quickStartPlan.create({
      data: {
        name,
        goal,
        level,
        dayOfWeek,
        dayName,
        muscleGroup,
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

// Get quick plan and its exercises handler
export const getQuickPlanExercise = async (
  req: QuickPlanRequest,
  res: Response
): Promise<void> => {
  const quickStartPlanId = req.params.id;

  try {
    const quickPlanExist = await prisma.quickStartPlan.findUnique({
      where: { id: quickStartPlanId },
    });

    if (!quickPlanExist) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const exercises = await prisma.quickStartPlan.findUnique({
      where: { id: quickStartPlanId },
      include: {
        quickStartExercises: {
          include: { exercise: true },
          orderBy: { order: "asc" },
        },
      },
    });

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching quick plan exercises:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update quick plan handler
export const updateQuickPlan = async (
  req: QuickPlanRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const quickStartPlanId = req.params.id;
  const {
    name,
    goal,
    level,
    dayOfWeek,
    dayName,
    muscleGroup,
    isRestDay,
    isActive,
  } = req.body;

  try {
    const quickPlanExist = await prisma.quickStartPlan.findUnique({
      where: { id: quickStartPlanId },
    });

    if (!quickPlanExist) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const updatedQuickStartPlan = await prisma.quickStartPlan.update({
      where: { id: quickStartPlanId },
      data: {
        name,
        goal,
        level,
        dayOfWeek,
        dayName,
        muscleGroup,
        isRestDay,
        isActive,
      },
    });
    res.status(200).json(updatedQuickStartPlan);
  } catch (error) {
    console.error("Error updating quick start plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
