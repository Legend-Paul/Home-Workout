import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("title").isString().withMessage("Title must be a string"),
  body("description").isString().withMessage("Description must be a string"),
  body("categoryId").isString().withMessage("Category ID must be a string"),
  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string"),
];

interface WorkoutRequest extends Request {
  body: {
    title: string;
    description: string;
    imageUrl: string;
    categoryId: string;
  };
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
  const { title, description, imageUrl, categoryId } = req.body;
  try {
    const workout = await prisma.workout.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        categoryId,
      },
    });
    res.status(201).json({ message: "Workout created successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workouts" });
  }
};
export const createWorkout = [...validate, createWorkoutHandler];

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await prisma.workout.findMany({
      include: { category: true },
    });
    res.status(200).json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
};
