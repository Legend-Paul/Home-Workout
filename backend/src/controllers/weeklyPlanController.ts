import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation middleware
const validate = [
  body("userPlanId").isString().withMessage("userPlanId must be a string"),
  body("name").isString().trim().withMessage("Name must be a string"),
  body("dayOfWeek")
    .isInt({ min: 0, max: 6 })
    .withMessage("dayOfWeek must be between 0 and 6"),
  body("muscleGroup")
    .customSanitizer((value) => (Array.isArray(value) ? value : [value]))
    .isArray({ min: 1 })
    .withMessage("muscleGroup must be an array with at least one item"),
  body("isRestDay")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("isRestDay must be a boolean"),
];

// Create createWeeklyPlan handler
interface WeeklyPlanRequest extends Request {
  body: {
    name: string;
    dayOfWeek: number;
    muscleGroup: string[];
    isRestDay: boolean;
    isActive: boolean;
  };
  params: {
    id: string;
    userPlanId: string;
  };
}

// Create WeeklyPlan
const createWeeklyPlanHandler = async (
  req: WeeklyPlanRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userId = req.user!.id;
  const { userPlanId } = req.params;
  const { name, dayOfWeek, muscleGroup, isRestDay } = req.body;

  try {
    const [userPlan, dayExists] = await Promise.all([
      prisma.userPlan.findUnique({
        where: { id: userPlanId },
      }),
      prisma.weeklyPlan.findUnique({
        where: { userPlanId_dayOfWeek: { userPlanId, dayOfWeek } },
      }),
    ]);

    if (!userPlan) {
      res.status(404).json({ error: "User plan not found" });
      return;
    }

    if (userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (dayExists) {
      res.status(400).json({ error: "A plan for this day already exists" });
      return;
    }

    const weeklyPlan = await prisma.weeklyPlan.create({
      data: {
        userPlanId,
        name,
        dayOfWeek,
        muscleGroup,
        isRestDay: isRestDay ?? false,
      },
    });

    res
      .status(201)
      .json({ message: "Weekly plan created successfully", weeklyPlan });
  } catch (error) {
    console.error("Error creating weekly plan:", error);
    res.status(500).json({ error: "Failed to create weekly plan" });
  }
};
export const createWeeklyPlan = [...validate, createWeeklyPlanHandler];

// Get weekly plan handler
const validateGetWeeklyPlan = [
  body("userId").isUUID().withMessage("User ID must be a valid UUID"),
];

interface GetAllWeeklyPlanRequest extends Request {
  body: {
    userId: string;
  };
}

const getAllWeeklyPlanHandler = async (
  req: GetAllWeeklyPlanRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { userId } = req.body;
  try {
    const userIdExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userIdExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const weeklyPlan = await prisma.weeklyPlan.findMany({
      where: {
        userId: userId,
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

export const getAllWeeklyPlan = [
  ...validateGetWeeklyPlan,
  getAllWeeklyPlanHandler,
];

// Update weekly plan handler
const updateWeeklyPlanHandler = async (
  req: WeeklyPlanRequest,
  res: Response,
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

// delete weekly plan handler
export const deleteWeeklyPlan = async (
  req: WeeklyPlanRequest,
  res: Response,
): Promise<void> => {
  const weeklyPlanId = req.params.id;

  try {
    const weeklyPlanExist = await prisma.weeklyPlan.findUnique({
      where: { id: weeklyPlanId },
    });

    if (!weeklyPlanExist) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    await prisma.weeklyPlan.delete({
      where: { id: weeklyPlanId },
    });
    res.status(200).json({ message: "Weekly plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting weekly plan:", error);
    res.status(500).json({ error: "Failed to delete weekly plan" });
  }
};
