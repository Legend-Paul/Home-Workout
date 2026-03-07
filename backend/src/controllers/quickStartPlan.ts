import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation middleware
const validate = [
  body("name").isString().withMessage("Name must be a string"),
  body("goal")
    .trim()
    .isIn(["BUILD_MUSCLE", "LOSE_FAT", "MAINTAIN_FITNESS"])
    .withMessage("Invalid goal"),
  body("level")
    .trim()
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"])
    .withMessage("Invalid level"),
  body("isActive")
    .toBoolean()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

interface NewQuickPlanRequest extends Request {
  body: {
    name: string;
    goal: "BUILD_MUSCLE" | "LOSE_FAT" | "MAINTAIN_FITNESS";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
    isActive: boolean;
  };
}

const createNewQuickPlanHandler = async (
  req: NewQuickPlanRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, goal, level, isActive } = req.body;

  try {
    const quickPlanExists = await prisma.quickStartPlan.findUnique({
      where: { name },
    });
    if (quickPlanExists) {
      res
        .status(400)
        .json({ error: "Quick start plan with that name already exists" });
      return;
    }
    const plan = await prisma.quickStartPlan.create({
      data: {
        name,
        goal,
        level,
        isActive,
        createdBy: req.user!.id || null,
      },
    });

    res.status(200).json({ message: "Plan created successifully", plan });
  } catch (error) {
    console.error("Error creating quick start plan:", error);
    res.status(500).json({ error: "Failed to create quick start plan" });
  }
};

export const createNewQuickPlan = [...validate, createNewQuickPlanHandler];

// Get all quickplans
export const getAllQuickPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.quickStartPlan.findMany({
      where: { isActive: true },
      include: {
        quickStartWeeklyPlan: {
          include: {
            _count: {
              select: { quickStartExercises: true },
            },
          },
        },
      },
    });

    const formattedPlans = plans.map((plan) => {
      const activeDays = plan.quickStartWeeklyPlan.filter(
        (day) => !day.isRestDay,
      );
      const totalExercises = plan.quickStartWeeklyPlan.reduce(
        (sum, day) => sum + day._count.quickStartExercises,
        0,
      );
      return {
        id: plan.id,
        name: plan.name,
        goal: plan.goal,
        level: plan.level,
        isActive: plan.isActive,
        totalExercises,
        activeDays: activeDays.length,
      };
    });

    res.status(200).json({ plans: formattedPlans });
  } catch (error) {
    console.error("Error fetching quick start plans:", error);
    res.status(500).json({ error: "Failed to fetch quick start plans" });
  }
};

// update quick plan
interface UpdateQuickPlanRequest extends NewQuickPlanRequest {
  params: {
    id: string;
  };
}

const updateQuickPlanHandler = async (
  req: UpdateQuickPlanRequest,
  res: Response,
) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, goal, level, isActive } = req.body;

  try {
    const plan = await prisma.quickStartPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    if (name && name !== plan.name) {
      const nameExists = await prisma.quickStartPlan.findUnique({
        where: { name },
      });
      if (nameExists) {
        res
          .status(400)
          .json({ error: "Quick start plan with that name already exists" });
        return;
      }
    }

    const updatedPlan = await prisma.quickStartPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(goal && { goal }),
        ...(level && { level }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({
      message: "Quick start plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating quick start plan:", error);
    res.status(500).json({ error: "Failed to update quick start plan" });
  }
};

export const updateQuickPlan = [...validate, updateQuickPlanHandler];

// Delete quick plans
interface DeleteQuickPlanRequest extends Request {
  params: {
    id: string;
  };
}

export const deleteQuickPlanHandler = async (
  req: DeleteQuickPlanRequest,
  res: Response,
) => {
  const { id } = req.params;

  try {
    const plan = await prisma.quickStartPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    await prisma.quickStartPlan.delete({
      where: { id },
    });

    res.status(200).json({ message: "Quick start plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting quick start plan:", error);
    res.status(500).json({ error: "Failed to delete quick start plan" });
  }
};
