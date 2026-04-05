import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation middleware
const validate = [
  body("reps").optional().isNumeric().withMessage("Reps must be a number"),
  body("sets").optional().isNumeric().withMessage("Sets must be a number"),
  body("order").isNumeric().withMessage("Order must be a number"),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("exerciseId").isUUID().withMessage("Invalid exercise ID"),
];

// Create createQuickPlanExercise handler
interface QuickPlanExerciseRequest extends Request {
  body: {
    reps?: number;
    sets?: number;
    order: number;
    duration?: number;
    exerciseId: string;
  };
  params: {
    id: string;
    weeklyPlanId: string;
    planId: string;
  };
}

const createQuickPlanExerciseHandler = async (
  req: QuickPlanExerciseRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { reps, sets, order, duration, exerciseId } = req.body;
  const { weeklyPlanId } = req.params;
  try {
    const [exerciseExists, weeklyPlanExists, quickPlanExerciseExist] =
      await Promise.all([
        prisma.exercise.findUnique({
          where: { id: exerciseId },
        }),
        prisma.quickStartWeeklyPlan.findUnique({
          where: { id: weeklyPlanId },
        }),
        prisma.quickStartExercise.findUnique({
          where: {
            quickStartWeeklyPlanId_exerciseId: {
              quickStartWeeklyPlanId: weeklyPlanId,
              exerciseId,
            },
          },
        }),
      ]);

    if (!exerciseExists) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    if (!weeklyPlanExists) {
      res.status(404).json({ error: "Quick start weekly plan not found" });
      return;
    }

    if (quickPlanExerciseExist) {
      res.status(404).json({ error: "Exercise exist in this weekly plan" });
      return;
    }

    const newQuickStartExercise = await prisma.quickStartExercise.create({
      data: {
        reps: reps || null,
        sets: sets || null,
        order,
        duration: duration || null,
        exerciseId,
        quickStartWeeklyPlanId: weeklyPlanId,
      },
    });
    res.status(201).json({
      message: "Exercise created successifully",
      exercise: newQuickStartExercise,
    });
  } catch (error) {
    console.error("Error creating quick plan exercise:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createQuickPlanExercise = [
  ...validate,
  createQuickPlanExerciseHandler,
];

// Get quick weekly plan and its exercises handler
export const getQuickPlanExercise = async (
  req: QuickPlanExerciseRequest,
  res: Response,
): Promise<void> => {
  const { planId, weeklyPlanId } = req.params;

  try {
    const [quickPlanExist, weeklyPlanExists] = await Promise.all([
      prisma.quickStartPlan.findUnique({
        where: { id: planId },
      }),
      prisma.quickStartWeeklyPlan.findUnique({
        where: { id: weeklyPlanId },
      }),
    ]);

    if (!quickPlanExist) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }
    if (!weeklyPlanExists) {
      res.status(404).json({ error: "Quick start weekly plan not found" });
      return;
    }

    const exercises = await prisma.quickStartExercise.findMany({
      where: {
        quickStartWeeklyPlanId: weeklyPlanId,
      },
    });

    res.status(200).json({ exercises });
  } catch (error) {
    console.error("Error fetching quick plan exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

// update quick plan exercise
const updateQuickPlanExerciseHandler = async (
  req: QuickPlanExerciseRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id, weeklyPlanId } = req.params;

  const { reps, sets, order, duration, exerciseId } = req.body;

  try {
    const [exerciseExists, weeklyPlanExists, planExerciseExist] =
      await Promise.all([
        prisma.exercise.findUnique({
          where: { id: exerciseId },
        }),
        prisma.quickStartWeeklyPlan.findUnique({
          where: { id: weeklyPlanId },
        }),
        prisma.quickStartExercise.findUnique({
          where: { id },
        }),
      ]);

    if (!planExerciseExist) {
      res.status(400).json({ error: "Quick start exercise not found" });
      return;
    }
    if (!exerciseExists) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    if (!weeklyPlanExists) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const updatedQuickStartPlanExercise =
      await prisma.quickStartExercise.update({
        where: {
          id,
        },
        data: {
          reps: reps || null,
          sets: sets || null,
          order,
          duration: duration || null,
          exerciseId,
        },
      });

    res.status(201).json({
      message: "Updated successfully",
      exercise: updatedQuickStartPlanExercise,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update quick start exercise" });
  }
};

export const updateQuickPlanExercise = [
  ...validate,
  updateQuickPlanExerciseHandler,
];

// delete quick plan exercise
export const deleteQuickPlanExercise = async (
  req: QuickPlanExerciseRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const planExerciseExist = await prisma.quickStartExercise.findUnique({
      where: { id: id },
    });

    if (!planExerciseExist) {
      res.status(400).json({ error: "Quick start exercise not found" });
      return;
    }

    const exercise = await prisma.quickStartExercise.delete({
      where: { id: id },
    });

    res
      .status(200)
      .json({ message: "Quick start exercise deleted successfully", exercise });
  } catch (error) {
    console.error("Error deleting quick start exercise:", error);
    res.status(500).json({ error: "Failed to delete quick start exercise" });
  }
};
