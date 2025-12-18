import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("name").isString().withMessage("Name must be a string"),
  body("description").isString().withMessage("Description must be a string"),
  body("category").isString().withMessage("Category  must be a string"),
  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string"),
];

interface WorkoutRequest extends Request {
  body: {
    name: string;
    description: string;
    imageUrl?: string;
    category: string;
  };
}

// Handler to create a new workout
const createWorkoutHandler = async (
  req: WorkoutRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, description, imageUrl, category } = req.body;

  try {
    const [workoutExists, categoryExists] = await Promise.all([
      prisma.workout.findUnique({
        where: { name },
      }),
      prisma.category.findUnique({
        where: { name: category },
      }),
    ]);

    if (workoutExists) {
      res.status(409).json({ error: "Workout with this name already exists" });
      return;
    }

    if (!categoryExists) {
      res.status(400).json({ error: "Category does not exist" });
      return;
    }

    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        categoryId: categoryExists.id,
      },
    });

    res.status(201).json({ message: "Workout created successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workouts" });
  }
};
export const createWorkout = [...validate, createWorkoutHandler];

// Handler to get all workouts
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

// Delete specific workout

interface WorkoutIdRequest extends Request {
  params: {
    id: string;
  };
}

export const deleteWorkout = async (req: WorkoutIdRequest, res: Response) => {
  const workoutId = req.params.id;

  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    await prisma.workout.delete({
      where: { id: workoutId },
    });

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
};

// Updating specific workout can be added here
export const updateWorkoutHandler = async (
  req: WorkoutIdRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const id = req.params.id;
  const { name, description, imageUrl, category } = req.body;
  try {
    const workoutExists = await prisma.workout.findUnique({
      where: { id },
    });

    if (!workoutExists) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const workout = await prisma.workout.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        categoryId: category,
      },
    });
    res.status(200).json({ message: "Workout updated successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update workout" });
  }
};

export const updateWorkout = [...validate, updateWorkoutHandler];
