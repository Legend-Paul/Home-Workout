import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation middleware
const validate = [
  body("weeklyPlanId")
    .isString()
    .withMessage("Weekly plan ID must be a string"),
  body("exerciseId").isString().withMessage("Exercise ID must be a string"),
  body("order")
    .isInt({ min: 1, max: 10 })
    .withMessage("Order must be between 1 and 10"),
  body("reps")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Reps must be a positive integer"),
  body("sets")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sets must be a positive integer"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
];

// Create createWeeklyPlanExercises handler
interface WeeklyPlanExerciseRequest extends Request {
  body: {
    exerciseId: string;
    order: number;
    reps?: number;
    sets?: number;
    duration?: number;
  };
  params: {
    weeklyPlanId: string;
    id: string;
  };
}

// Create WeeklyPlanExercise
const createWeeklyPlanExerciseHandler = async (
  req: WeeklyPlanExerciseRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userId = req.user!.id;
  const { weeklyPlanId } = req.params;
  const { exerciseId, order, reps, sets, duration } = req.body;

  try {
    const [weeklyPlan, exercise] = await Promise.all([
      prisma.weeklyPlan.findUnique({
        where: { id: weeklyPlanId },
        include: { userPlan: true },
      }),
      prisma.exercise.findUnique({
        where: { id: exerciseId },
      }),
    ]);

    const exerciseExists = await prisma.weeklyPlanExercise.findUnique({
      where: { weeklyPlanId_exerciseId: { weeklyPlanId, exerciseId } },
    });

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    if (weeklyPlan.userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    if (exerciseExists) {
      res
        .status(400)
        .json({ error: "Exercise already exists in this weekly plan" });
      return;
    }

    const weeklyPlanExercise = await prisma.weeklyPlanExercise.create({
      data: {
        weeklyPlanId,
        exerciseId,
        order,
        reps: reps || null,
        sets: sets || null,
        duration: duration || null,
      },
    });

    res.status(201).json({
      message: "Exercise added to weekly plan successfully",
      weeklyPlanExercise,
    });
  } catch (error) {
    console.error("Error creating weekly plan exercise:", error);
    res.status(500).json({ error: "Failed to create weekly plan exercise" });
  }
};

export const createWeeklyPlanExercise = [
  ...validate,
  createWeeklyPlanExerciseHandler,
];

export const getWeekDayExercises = async (
  req: WeekDayExerciseRequest,
  res: Response,
): Promise<void> => {
  const { planId } = req.params;

  try {
    const weeklyPlan = await prisma.weeklyPlan.findUnique({
      where: { id: planId },
    });

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }
    const exercises = await prisma.weeklyPlanExercise.findMany({
      where: {
        weeklyPlanId: planId,
      },
      include: {
        exercise: true,
      },
    });

    res.status(200).json(exercises);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get week exercises" });
  }
};

export const updateWeekDayExercises = async (
  req: WeekDayExerciseRequest,
  res: Response,
): Promise<void> => {
  const { planId, id } = req.params;
  const { exerciseId, order, reps, sets, duration } = req.body;

  try {
    const [weeklyPlan, exercise, weekDayExercise] = await Promise.all([
      prisma.weeklyPlan.findUnique({
        where: { id: planId },
      }),
      prisma.exercise.findUnique({
        where: { id: exerciseId },
      }),
      prisma.weeklyPlanExercise.findUnique({
        where: { id: id },
      }),
    ]);

    if (!weekDayExercise) {
      res.status(404).json({ error: "Week day exercise not found" });
      return;
    }

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    const updatedExercise = await prisma.weeklyPlanExercise.update({
      where: {
        id: id,
      },
      data: {
        exerciseId,
        order,
        reps: reps || null,
        sets: sets || null,
        duration: duration || null,
      },
    });

    res.status(200).json({
      message: "Week day exercise(s) updated successfully",
      exercise: updatedExercise,
    });
  } catch (error) {
    console.error("Error updating week day exercise:", error);
    res.status(500).json({ error: "Failed to update week day exercise" });
  }
};

// Delete week day exercise handler
export const deleteWeekDayExercises = async (
  req: WeekDayExerciseRequest,
  res: Response,
): Promise<void> => {
  const { planId, id } = req.params;

  try {
    const [weeklyPlan, weekDayExercise] = await Promise.all([
      prisma.weeklyPlan.findUnique({
        where: { id: planId },
      }),
      prisma.weeklyPlanExercise.findUnique({
        where: { id: id },
      }),
    ]);

    if (!weekDayExercise) {
      res.status(404).json({ error: "Week day exercise not found" });
      return;
    }

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    await prisma.weeklyPlanExercise.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Week day exercise deleted successfully" });
  } catch (error) {
    console.error("Error deleting week day exercise:", error);
    res.status(500).json({ error: "Failed to delete week day exercise" });
  }
};
