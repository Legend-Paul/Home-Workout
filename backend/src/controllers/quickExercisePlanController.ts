import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("name").isString().withMessage("Name must be a string"),
  body("dayOfWeek")
    .isNumeric()
    .withMessage("Day of week must be a number")
    .custom((value) => value >= 0 && value <= 6)
    .withMessage("Day of week must be between 0 and 6"),
  body("muscleGroup")
    .isArray({ min: 0 })
    .withMessage("Muscle group must be an array"),
  body("isRestDay")
    .toBoolean()
    .isBoolean()
    .withMessage("isRestDay must be a boolean"),
];

// Create createQuickStartPlan handler
interface QuickPlanRequest extends Request {
  body: {
    name: string;
    dayOfWeek: number;
    muscleGroup: string[];
    isRestDay: boolean;
  };
  params: {
    id: string;
    planId: string;
  };
}

const createQuickPlanHandler = async (
  req: QuickPlanRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, dayOfWeek, muscleGroup, isRestDay } = req.body;
  const { planId } = req.params;

  try {
    const quickPlanExists = await prisma.quickStartPlan.findUnique({
      where: { id: planId },
    });
    if (!quickPlanExists) {
      res.status(400).json({ error: "Quick start plan not found!" });
      return;
    }

    const newQuickStartPlan = await prisma.quickStartWeeklyPlan.create({
      data: {
        quickStartPlanId: planId,
        name,
        dayOfWeek,
        muscleGroup,
        isRestDay,
      },
    });
    res
      .status(201)
      .json({ message: "Plan created successifully", plan: newQuickStartPlan });
  } catch (error) {
    console.error("Error creating quick start plan:", error);
    res.status(500).json({ error: "Failed to create plan" });
  }
};
export const createQuickPlan = [...validate, createQuickPlanHandler];

// Get quik wekly plan
interface GetQuickWeeklyPlanRequest extends Request {
  params: {
    planId: string;
  };
}

export const getQuickWeeklyPlan = async (
  req: GetQuickWeeklyPlanRequest,
  res: Response,
): Promise<void> => {
  const { planId } = req.params;

  try {
    const quickPlanExists = await prisma.quickStartPlan.findUnique({
      where: { id: planId },
    });

    if (!quickPlanExists) {
      res.status(400).json({ error: "Quick start plan not found!" });
      return;
    }
    const allPlans = await prisma.quickStartWeeklyPlan.findMany({
      where: {
        quickStartPlanId: planId,
      },

      include: {
        _count: {
          select: {
            quickStartExercises: true,
          },
        },
      },
    });
    res.status(200).json({ plans: allPlans });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch quick start plans" });
  }
};

// Update quick plan handler
const updateQuickPlanHandler = async (
  req: QuickPlanRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, dayOfWeek, muscleGroup, isRestDay } = req.body;

  const { planId, id } = req.params;

  try {
    const [weeklyPlanExists, quickPlanExists] = await Promise.all([
      prisma.quickStartPlan.findUnique({
        where: { id: planId },
      }),
      prisma.quickStartPlan.findUnique({
        where: { id },
      }),
    ]);

    if (!weeklyPlanExists) {
      res.status(400).json({ error: "weekly start plan not found!" });
      return;
    }

    if (!quickPlanExists) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const updatedQuickWeeklylan = await prisma.quickStartWeeklyPlan.update({
      where: { id },
      data: {
        name,
        dayOfWeek,
        muscleGroup,
        isRestDay,
      },
    });
    res.status(200).json({
      message: "Plan updated successifully",
      plan: updatedQuickWeeklylan,
    });
  } catch (error) {
    console.error("Error updating quick start plan:", error);
    res.status(500).json({ error: "Failed to update plan" });
  }
};

export const updateQuickPlan = [...validate, updateQuickPlanHandler];

// delete quick plan handler
interface DeleteQuickWeeklyPlanRequest extends Request {
  params: {
    id: string;
  };
}

export const deleteQuickPlan = async (
  req: DeleteQuickWeeklyPlanRequest,
  res: Response,
): Promise<void> => {
  const quickWeeklyPlanId = req.params.id;
  try {
    const planExist = await prisma.quickStartWeeklyPlan.findUnique({
      where: {
        id: quickWeeklyPlanId,
      },
    });

    if (!planExist) {
      res.status(400).json({ message: "Plan does not exist" });
      return;
    }

    await prisma.quickStartPlan.delete({
      where: { id: quickWeeklyPlanId },
    });
    res.status(200).json({ message: "Quick start plan deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete plan" });
  }
};
