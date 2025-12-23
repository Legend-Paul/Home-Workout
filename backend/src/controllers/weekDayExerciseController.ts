import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation middleware
const validate = [
  body("exerciseId").isUUID().withMessage("Exercise ID must be a valid UUID"),
  body("order").isNumeric().withMessage("Order must be a number"),
  body("reps").optional().isNumeric().withMessage("Reps must be a number"),
  body("sets").optional().isNumeric().withMessage("Sets must be a number"),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
];

// Create createWeekDayExercises handler
interface WeekDayExerciseRequest extends Request {
  body: {
    exerciseId: string;
    order: number;
    reps?: number;
    sets?: number;
    duration?: number;
  };
  params: {
    planId: string;
    id: string;
  };
}

export const createWeekDayExercises = [
  ...validate,
  async (req: WeekDayExerciseRequest, res: Response): Promise<void> => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { exerciseId, order, reps, sets, duration } = req.body;
    const { planId } = req.params;

    try {
      const [exercise, weeklyPlan] = await Promise.all([
        prisma.exercise.findUnique({ where: { id: exerciseId } }),
        prisma.weeklyPlan.findUnique({ where: { id: planId } }),
      ]);

      if (!exercise) {
        res.status(404).json({ error: "Exercise not found" });
        return;
      }

      if (!weeklyPlan) {
        res.status(404).json({ error: "Weekly plan not found" });
        return;
      }

      // Create new week day exercise
      const newWeekDayExercise = await prisma.weeklyPlanExercise.create({
        data: {
          exerciseId,
          weeklyPlanId: planId,
          order,
          reps: reps || null,
          sets: sets || null,
          duration: duration || null,
        },
      });
      res.status(201).json({
        message: "Week day exercise created successfully",
        exercise: newWeekDayExercise,
      });
    } catch (error) {
      console.error("Error creating week day exercise:", error);
      res.status(500).json({ error: "Failed to create week day exercise" });
    }
  },
];

export const getWeekDayExercises = async (
  req: WeekDayExerciseRequest,
  res: Response
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
  res: Response
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
  res: Response
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
