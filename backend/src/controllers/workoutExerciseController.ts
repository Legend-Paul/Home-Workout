import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// Create exercises for a specific workout
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

// Get exercises for a specific workout
export const getWorkoutExercises = async (
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

    const exercises = await prisma.workoutExercise.findMany({
      where: {
        workoutId: workout?.id,
      },
      include: {
        exercise: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    const others = await prisma.exercise.findMany({
      where: {
        NOT: {
          id: {
            in: exercises.map((we) => we.exerciseId),
          },
        },
      },
    });

    res.status(200).json({ workout, exercises, others });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
};
