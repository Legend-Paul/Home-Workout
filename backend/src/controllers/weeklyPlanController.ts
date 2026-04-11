import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import type { QuickWeeklyPlanWithCount } from "../types/types.js";

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

// Get all WeeklyPlans for a UserPlan
interface GetWeeklyPlanRequest extends Request {
  params: {
    userPlanId: string;
  };
}

export const getWeeklyPlans = async (
  req: GetWeeklyPlanRequest,
  res: Response,
) => {
  const { userPlanId } = req.params;
  const userId = req.user!.id;

  try {
    const userPlan = await prisma.userPlan.findUnique({
      where: { id: userPlanId },
    });

    if (!userPlan) {
      res.status(404).json({ error: "User plan not found" });
      return;
    }

    if (userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const weeklyPlans = await prisma.weeklyPlan.findMany({
      where: { userPlanId },
      include: {
        _count: {
          select: { weeklyPlanExercises: true },
        },
      },
      orderBy: { dayOfWeek: "asc" },
    });

    const formattedPlans = weeklyPlans.map(
      (plan: QuickWeeklyPlanWithCount) => ({
        id: plan.id,
        name: plan.name,
        dayOfWeek: plan.dayOfWeek,
        muscleGroup: plan.muscleGroup,
        isRestDay: plan.isRestDay,
        isActive: plan.isActive,
        totalExercises: plan._count.weeklyPlanExercises,
      }),
    );

    res.status(200).json({ weeklyPlans: formattedPlans });
  } catch (error) {
    console.error("Error fetching weekly plans:", error);
    res.status(500).json({ error: "Failed to fetch weekly plans" });
  }
};

// Update WeeklyPlan
const updateWeeklyPlanHandler = async (
  req: WeeklyPlanRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id, userPlanId } = req.params;
  const userId = req.user!.id;
  const { name, dayOfWeek, muscleGroup, isRestDay, isActive } = req.body;

  try {
    const weeklyPlan = await prisma.weeklyPlan.findUnique({
      where: { id },
      include: { userPlan: true },
    });

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    if (weeklyPlan.userPlan.id !== userPlanId) {
      res.status(404).json({ error: "Invalid user plan" });
      return;
    }

    if (weeklyPlan.userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (dayOfWeek !== undefined && dayOfWeek !== weeklyPlan.dayOfWeek) {
      const dayExists = await prisma.weeklyPlan.findUnique({
        where: {
          userPlanId_dayOfWeek: {
            userPlanId: weeklyPlan.userPlanId,
            dayOfWeek,
          },
        },
      });

      if (dayExists) {
        res.status(400).json({ error: "A plan for this day already exists" });
        return;
      }
    }

    const updatedPlan = await prisma.weeklyPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(muscleGroup && { muscleGroup }),
        ...(isRestDay !== undefined && { isRestDay }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({
      message: "Weekly plan updated successfully",
      weeklyPlan: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating weekly plan:", error);
    res.status(500).json({ error: "Failed to update weekly plan" });
  }
};
export const updateWeeklyPlan = [...validate, updateWeeklyPlanHandler];

// Delete WeeklyPlan
interface DeleteWeeklyPlanRequest extends Request {
  params: {
    userPlanId: string;
    id: string;
  };
}
export const deleteWeeklyPlan = async (
  req: DeleteWeeklyPlanRequest,
  res: Response,
) => {
  const { id, userPlanId } = req.params;
  const userId = req.user!.id;

  try {
    const weeklyPlan = await prisma.weeklyPlan.findUnique({
      where: { id },
      include: { userPlan: true },
    });

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    if (weeklyPlan.userPlan.id !== userPlanId) {
      res.status(404).json({ error: "Invalid user plan" });
      return;
    }

    if (weeklyPlan.userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.weeklyPlan.delete({ where: { id } });

    res.status(200).json({ message: "Weekly plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting weekly plan:", error);
    res.status(500).json({ error: "Failed to delete weekly plan" });
  }
};
