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
