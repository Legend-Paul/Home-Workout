import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation middleware
const validate = [
  body("name").isString().withMessage("Name must be a string"),
  body("userId").isUUID().withMessage("User ID must be a valid UUID"),
  body("dayOfWeek")
    .isNumeric()
    .withMessage("Day of week must be a number")
    .custom((value) => value >= 0 && value <= 6)
    .withMessage("Day of week must be between 0 and 6"),
  body("dayName")
    .isIn([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ])
    .withMessage("DayName must be a valid day of the week"),
  body("muscleGroup")
    .isArray({ min: 0 })
    .withMessage("Muscle group must be an array"),
  body("isRestDay").isBoolean().withMessage("isRestDay must be a boolean"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
];

// Create createWeeklyPlan handler
interface WeeklyPlanRequest extends Request {
  body: {
    name: string;
    userId: string;
    dayOfWeek: number;
    dayName:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    muscleGroup: string[];
    isRestDay: boolean;
    isActive: boolean;
  };
  params: {
    id: string;
  };
}

const createWeeklyPlanHandler = async (
  req: WeeklyPlanRequest,
  res: Response
): Promise<void> => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, userId, dayOfWeek, dayName, muscleGroup, isRestDay, isActive } =
    req.body;

  try {
    const userIdExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userIdExists) {
      res.status(404).json({ error: "User ID does not exist" });
      return;
    }

    // Create new weekly plan
    const newWeeklyPlan = await prisma.weeklyPlan.create({
      data: {
        name,
        userId,
        dayOfWeek,
        dayName,
        muscleGroup,
        isRestDay,
        isActive,
      },
    });
    res.status(201).json({
      message: "Weekly plan created successfully",
      plan: newWeeklyPlan,
    });
  } catch (error) {
    console.error("Error creating weekly plan:", error);
    res.status(500).json({ error: "Failed to create weekly plan" });
  }
};

export const createWeeklyPlan = [...validate, createWeeklyPlanHandler];

// Get weekly plan handler
const validateGetWeeklyPlan = [
  body("userId").isUUID().withMessage("User ID must be a valid UUID"),
  body("dayOfWeek")
    .isNumeric()
    .withMessage("Day of week must be a number")
    .custom((value) => value >= 0 && value <= 6)
    .withMessage("Day of week must be between 0 and 6"),
];

interface GetWeeklyPlanRequest extends Request {
  body: {
    userId: string;
    dayOfWeek: number;
  };
}

const getWeeklyPlanHandler = async (
  req: GetWeeklyPlanRequest,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { userId, dayOfWeek } = req.body;
  try {
    const userIdExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userIdExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const weeklyPlan = await prisma.weeklyPlan.findUnique({
      where: {
        userId_dayOfWeek: {
          userId,
          dayOfWeek,
        },
      },
      include: {
        weeklyPlanExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    res.status(200).json({ plan: weeklyPlan });
  } catch (error) {
    console.error("Error retrieving weekly plan:", error);
    res.status(500).json({ error: "Failed to retrieve weekly plan" });
  }
};

export const getWeeklyPlan = [...validateGetWeeklyPlan, getWeeklyPlanHandler];

// Update weekly plan handler
const updateWeeklyPlanHandler = async (
  req: WeeklyPlanRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const weeklyPlanId = req.params.id;
  const { name, dayOfWeek, dayName, muscleGroup, isRestDay, isActive } =
    req.body;

  try {
    const weeklyPlanExist = await prisma.weeklyPlan.findUnique({
      where: { id: weeklyPlanId },
    });

    if (!weeklyPlanExist) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    const updatedWeeklyPlan = await prisma.weeklyPlan.update({
      where: { id: weeklyPlanId },
      data: {
        name,
        dayOfWeek,
        dayName,
        muscleGroup,
        isRestDay,
        isActive,
      },
    });
    res.status(200).json({
      message: "Weekly plan updated successfully",
      plan: updatedWeeklyPlan,
    });
  } catch (error) {
    console.error("Error updating weekly plan:", error);
    res.status(500).json({ error: "Failed to update weekly plan" });
  }
};
export const updateWeeklyPlan = [...validate, updateWeeklyPlanHandler];
