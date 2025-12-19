import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { body, validationResult } from "express-validator";

const validate = [
  body().isArray().withMessage("Data must be an array"),
  body("*.userId").trim().isString().withMessage("User ID must be a string"),
  body("*.workoutExerciseId")
    .isString()
    .withMessage("Workout exercise ID must an array"),
  body("*.categoryId").isString().withMessage("Category ID must be a an array"),
  body("*.order")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
  body("*.dayOfWeek")
    .isInt({ min: 0, max: 6 })
    .withMessage("Day of week must be an integer between 0 and 6"),
  body("*.duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),
  body("*.reps")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Reps must be a positive integer"),
  body("*.sets")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sets must be a positive integer"),
];

interface CreateWorkoutRequest extends Request {
  body: Array<{
    userId: string;
    workoutExerciseId: string;
    categoryId: string;
    order: number;
    dayOfWeek: number;
    duration?: number;
    reps?: number;
    sets?: number;
  }>;
}

const createWorkoutHandler = async (
  req: CreateWorkoutRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userWorkoutExercise = req.body;

  try {
    const userWorkout = await prisma.userWorkoutExercise.createMany({
      data: userWorkoutExercise,
    });
    res.status(201).json(userWorkout);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
export const createWorkout = [...validate, createWorkoutHandler];
