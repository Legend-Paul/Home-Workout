import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body().isArray().withMessage("Request body should be an array"),
  body("*.title").isString().withMessage("Title must be a string"),
  body("*.description").isString().withMessage("Description must be a string"),
  body("*.categoryId").isString().withMessage("Category ID must be a string"),
  body("*.imgUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string"),
];

interface WorkoutRequest extends Request {
  body: Array<{
    title: string;
    description: string;
    imgUrl: string;
    categoryId: string;
  }>;
}

const createWorkoutHandler = async (
  req: WorkoutRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const workouts = req.body;
  console.log("Received workouts:", workouts);
  try {
    const workout = await prisma.workout.createMany({
      data: workouts,
    });
    res.status(201).json({ message: "Workouts created successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workouts" });
  }
};

export const createWorkout = [...validate, createWorkoutHandler];
