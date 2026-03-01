import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation
const validate = [
  body("name").isString().trim().withMessage("Name must be a string"),
];

interface CreateUserPlan extends Request {
  body: {
    name: string;
  };
}

// Create UserPlan
const createUserPlanHandler = async (req: CreateUserPlan, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name } = req.body;
  const userId = req.user!.id;

  try {
    const planExists = await prisma.userPlan.findUnique({
      where: { userId_name: { userId, name } },
    });

    if (planExists) {
      res.status(400).json({ error: "Plan with that name already exists" });
      return;
    }

    const plan = await prisma.userPlan.create({
      data: { name, userId },
    });

    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    console.error("Error creating user plan:", error);
    res.status(500).json({ error: "Failed to create user plan" });
  }
};

export const createUserPlan = [...validate, createUserPlanHandler];

// Get all UserPlans for logged in user
export const getUserPlans = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const plans = await prisma.userPlan.findMany({
      where: { userId, isActive: true },
      include: {
        weeklyPlan: {
          include: {
            _count: {
              select: { weeklyPlanExercises: true },
            },
          },
        },
      },
    });

    const formattedPlans = plans.map((plan) => {
      const activeDays = plan.weeklyPlan.filter((day) => !day.isRestDay);
      const totalExercises = plan.weeklyPlan.reduce(
        (sum, day) => sum + day._count.weeklyPlanExercises,
        0,
      );

      return {
        id: plan.id,
        name: plan.name,
        isActive: plan.isActive,
        totalExercises,
        activeDays: activeDays.length,
        createdAt: plan.createdAt,
      };
    });

    res.status(200).json({ plans: formattedPlans });
  } catch (error) {
    console.error("Error fetching user plans:", error);
    res.status(500).json({ error: "Failed to fetch user plans" });
  }
};

// Update UserPlan

interface UpdateUserPlanRequest extends Request {
  body: {
    name: string;
    isActive: boolean;
  };
  params: {
    id: string;
  };
}

const updateValidate = [
  body("name")
    .optional()
    .isString()
    .trim()
    .withMessage("Name must be a string"),
  body("isActive")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const updateUserPlanHandler = async (
  req: UpdateUserPlanRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const userId = req.user!.id;
  const { name, isActive } = req.body;

  try {
    const plan = await prisma.userPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    if (plan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (name && name !== plan.name) {
      const nameExists = await prisma.userPlan.findUnique({
        where: { userId_name: { userId, name } },
      });
      if (nameExists) {
        res.status(400).json({ error: "Plan with that name already exists" });
        return;
      }
    }

    const updatedPlan = await prisma.userPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res
      .status(200)
      .json({ message: "Plan updated successfully", plan: updatedPlan });
  } catch (error) {
    console.error("Error updating user plan:", error);
    res.status(500).json({ error: "Failed to update user plan" });
  }
};

export const updateUserPlan = [...updateValidate, updateUserPlanHandler];

// Delete UserPlan
interface DeleteUserPlanRequest extends Request {
  params: {
    id: string;
  };
}

export const deleteUserPlan = async (
  req: DeleteUserPlanRequest,
  res: Response,
) => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const plan = await prisma.userPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    if (plan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.userPlan.delete({ where: { id } });

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting user plan:", error);
    res.status(500).json({ error: "Failed to delete user plan" });
  }
};
