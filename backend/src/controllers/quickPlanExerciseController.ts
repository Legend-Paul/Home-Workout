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
    planId: string;
  };
}

const createQuickPlanExerciseHandler = async (
  req: QuickPlanExerciseRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { reps, sets, order, duration, exerciseId } = req.body;
  const quickStartPlanId = req.params.planId;
  try {
    const [exerciseExists, planExists] = await Promise.all([
      prisma.exercise.findUnique({
        where: { id: exerciseId },
      }),
      prisma.quickStartPlan.findUnique({
        where: { id: quickStartPlanId },
      }),
    ]);

    if (!exerciseExists) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    if (!planExists) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const newQuickStartExercise = await prisma.quickStartExercise.create({
      data: {
        reps: reps || null,
        sets: sets || null,
        order,
        duration: duration || null,
        exerciseId,
        quickStartPlanId,
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

// Get quick plan and its exercises handler
export const getQuickPlanExercise = async (
  req: QuickPlanExerciseRequest,
  res: Response
): Promise<void> => {
  const quickStartPlanId = req.params.planId;

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
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

// update quick plan exercise
const updateQuickPlanExerciseHandler = async (
  req: QuickPlanExerciseRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { planId, id } = req.params;

  const { reps, sets, order, duration, exerciseId } = req.body;
  const quickStartPlanId = req.params.planId;
  try {
    const [exerciseExists, planExists, planExerciseExist] = await Promise.all([
      prisma.exercise.findUnique({
        where: { id: exerciseId },
      }),
      prisma.quickStartPlan.findUnique({
        where: { id: quickStartPlanId },
      }),
      prisma.quickStartExercise.findUnique({
        where: { id: id },
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

    if (!planExists) {
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
          quickStartPlanId: planId,
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
  res: Response
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

    await prisma.quickStartExercise.delete({
      where: { id: id },
    });

    res
      .status(200)
      .json({ message: "Quick start exercise deleted successfully" });
  } catch (error) {
    console.error("Error deleting quick start exercise:", error);
    res.status(500).json({ error: "Failed to delete quick start exercise" });
  }
};
