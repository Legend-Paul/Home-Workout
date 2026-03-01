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

const updateValidate = [
  body("order")
    .optional()
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

// Get all WeeklyPlanExercises for a weekly plan
interface GetWeeklyPlanExercisesRequest extends Request {
  params: {
    weeklyPlanId: string;
  };
}

export const getWeeklyPlanExercises = async (
  req: GetWeeklyPlanExercisesRequest,
  res: Response,
) => {
  const { weeklyPlanId } = req.params;
  const userId = req.user!.id;

  try {
    const weeklyPlan = await prisma.weeklyPlan.findUnique({
      where: { id: weeklyPlanId },
      include: { userPlan: true },
    });

    if (!weeklyPlan) {
      res.status(404).json({ error: "Weekly plan not found" });
      return;
    }

    if (weeklyPlan.userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const exercises = await prisma.weeklyPlanExercise.findMany({
      where: { weeklyPlanId },
      include: {
        exercise: true,
      },
      orderBy: { order: "asc" },
    });

    res.status(200).json({ exercises });
  } catch (error) {
    console.error("Error fetching weekly plan exercises:", error);
    res.status(500).json({ error: "Failed to fetch weekly plan exercises" });
  }
};

// Update WeeklyPlanExercise
interface UpdateWeeklyPlanExerciseRequest extends Request {
  body: {
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

export const updateWeeklyPlanExerciseHandler = async (
  req: UpdateWeeklyPlanExerciseRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id, weeklyPlanId } = req.params;
  const userId = req.user!.id;
  const { order, reps, sets, duration } = req.body;

  try {
    const weeklyPlanExercise = await prisma.weeklyPlanExercise.findUnique({
      where: { id },
      include: {
        weeklyPlan: {
          include: { userPlan: true },
        },
      },
    });

    if (!weeklyPlanExercise) {
      res.status(404).json({ error: "Weekly plan exercise not found" });
      return;
    }

    if (weeklyPlanExercise.weeklyPlan.id !== weeklyPlanId) {
      res.status(404).json({ error: "Invalid weekly plan" });
      return;
    }

    if (weeklyPlanExercise.weeklyPlan.userPlan.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const updatedExercise = await prisma.weeklyPlanExercise.update({
      where: { id },
      data: {
        ...(order !== undefined && { order }),
        ...(reps !== undefined && { reps }),
        ...(sets !== undefined && { sets }),
        ...(duration !== undefined && { duration }),
      },
    });

    res
      .status(200)
      .json({
        message: "Weekly plan exercise updated successfully",
        exercise: updatedExercise,
      });
  } catch (error) {
    console.error("Error updating weekly plan exercise:", error);
    res.status(500).json({ error: "Failed to update weekly plan exercise" });
  }
};
export const updateWeeklyPlanExercise = [
  ...updateValidate,
  updateWeeklyPlanExerciseHandler,
];

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
