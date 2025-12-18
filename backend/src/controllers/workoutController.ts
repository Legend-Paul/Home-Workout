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

interface WorkoutNameRequest extends Request {
  params: {
    name: string;
  };
  body: {
    exerciseId: string;
    order: number;
  };
}

export const createWorkoutExercises = async (
  req: WorkoutNameRequest,
  res: Response
): Promise<void> => {
  const workoutName = req.params.name;

  try {
    const workout = await prisma.workout.findUnique({
      where: {
        name:
          workoutName.charAt(0).toUpperCase() +
          workoutName.slice(1).toLocaleLowerCase(),
      },
    });

    if (!workout) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    const { exerciseId, order } = req.body;

    await prisma.workoutExercise.create({
      data: {
        workoutId: workout.id,
        exerciseId,
        order: Number(order),
      },
    });

    res
      .status(200)
      .json({ message: `Exercises created for workout: ${workoutName}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workout exercises" });
  }
};

export const getWorkoutByName = async (
  req: WorkoutNameRequest,
  res: Response
): Promise<void> => {
  const workoutName = req.params.name;

  try {
    const workout = await prisma.workout.findUnique({
      where: {
        name:
          workoutName.charAt(0).toUpperCase() +
          workoutName.slice(1).toLocaleLowerCase(),
      },
      include: {
        category: {
          include: { exercises: true },
        },
      },
    });

    if (!workout) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }

    res.status(200).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
};
