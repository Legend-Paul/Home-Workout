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

const createQuickWeeklyPlanHandler = async (
  req: QuickPlanRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, dayOfWeek, muscleGroup, isRestDay } = req.body;
  const { planId } = req.params;

  try {
    const [quickPlanExists, dayOfWeekExist] = await Promise.all([
      prisma.quickStartPlan.findUnique({
        where: { id: planId },
      }),

      prisma.quickStartWeeklyPlan.findUnique({
        where: {
          quickStartPlanId_dayOfWeek: {
            quickStartPlanId: planId,
            dayOfWeek,
          },
        },
      }),
    ]);

    if (!quickPlanExists) {
      res.status(400).json({ error: "Quick start plan not found!" });
      return;
    }
    console.log(dayOfWeekExist);
    console.log(dayOfWeek);
    if (dayOfWeekExist) {
      res.status(400).json({ error: "Day of the week already exist!" });
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
    res.status(500).json({ error: "Failed to create weekly plan" });
  }
};

export const createQuickWeeklyPlan = [
  ...validate,
  createQuickWeeklyPlanHandler,
];

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
  console.log(planId);

  try {
    const plan = await prisma.quickStartPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const weeklyPlans = await prisma.quickStartWeeklyPlan.findMany({
      where: { quickStartPlanId: planId },
      orderBy: { dayOfWeek: "asc" },
      include: {
        quickStartExercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
          },
        },
      },
    });

    res.status(200).json({ weeklyPlans });
  } catch (error) {
    console.error("Error fetching quick start weekly plans:", error);
    res.status(500).json({ error: "Failed to fetch weekly plans" });
  }
};

// Get wekly plan by id
interface QuickWeeklyPlanById extends Request {
  params: {
    id: string;
    planId: string;
  };
}

export const quickWeeklyPlanById = async (
  req: QuickWeeklyPlanById,
  res: Response,
) => {
  const { id, planId } = req.params;
  try {
    const [planExists, weeklyPlanExists] = await Promise.all([
      prisma.quickStartPlan.findUnique({
        where: { id: planId },
      }),
      prisma.quickStartWeeklyPlan.findUnique({
        where: { id },
      }),
    ]);
    if (!planExists) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    if (!weeklyPlanExists) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    res.status(200).json({ weeklyPlan: weeklyPlanExists });
  } catch (error) {
    console.error("Error fetching quick start weekly plan:", error);
    res.status(500).json({ error: "Failed to fetch weekly plan" });
  }
};

// Update quick plan handler
const updateQuickWeeklyPlanHandler = async (
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
    res.status(500).json({ error: "Failed to update quick weekly plan" });
  }
};

export const updateQuickWeeklyPlan = [
  ...validate,
  updateQuickWeeklyPlanHandler,
];

// delete quick plan handler
interface DeleteQuickWeeklyPlanRequest extends Request {
  params: {
    id: string;
    planId: string;
  };
}

export const deleteQuickWeeklyPlan = async (
  req: DeleteQuickWeeklyPlanRequest,
  res: Response,
): Promise<void> => {
  const { id, planId } = req.params;

  try {
    const quickPlanExists = await prisma.quickStartPlan.findUnique({
      where: { id: planId },
    });

    if (!quickPlanExists) {
      res.status(400).json({ error: "Quick start plan not found!" });
      return;
    }

    const planExist = await prisma.quickStartWeeklyPlan.findUnique({
      where: {
        id: id,
      },
    });

    if (!planExist) {
      res.status(400).json({ message: "Plan does not exist" });
      return;
    }

    await prisma.quickStartPlan.delete({
      where: { id: id },
    });
    res.status(200).json({ message: "Quick start plan deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete  weekly plan" });
  }
};
