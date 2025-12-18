import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

interface WorkoutIdRequest extends Request {
  params: {
    id: string;
  };
  body: {
    exerciseId: string;
    order: number;
  };
}

// Create exercises for a specific workout
export const addWorkoutExercises = async (
  req: WorkoutIdRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id,
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

    res.status(200).json({ message: `Exercises added` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create workout exercises" });
  }
};

// Get exercises for a specific workout
export const getWorkoutExercises = async (
  req: WorkoutIdRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id,
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

//delete exercises from a specific workout
export const deleteWorkoutExercises = async (
  req: WorkoutIdRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { exerciseId } = req.body;

  try {
    const workout = await prisma.workoutExercise.findUnique({
      where: {
        workoutId_exerciseId: {
          workoutId: id,
          exerciseId: exerciseId,
        },
      },
    });

    if (!workout) {
      res.status(404).json({ error: "Workout Exercise not found" });
      return;
    }

    await prisma.workoutExercise.delete({
      where: {
        workoutId_exerciseId: {
          workoutId: id,
          exerciseId: exerciseId,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete workout exercise" });
  }
};
