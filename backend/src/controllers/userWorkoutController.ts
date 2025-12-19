import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { body, validationResult } from "express-validator";

const validate = [
  body().isArray().withMessage("Data must be an array"),
  body("*.userId").trim().isUUID().withMessage("User ID must be a a UUID"),
  body("*.workoutExerciseId")
    .isUUID()
    .withMessage("Workout exercise ID must be a UUID"),
  body("*.categoryId").isUUID().withMessage("Category ID must be a UUID"),
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

interface CreateUserWorkoutRequest extends Request {
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

const createUserWorkoutHandler = async (
  req: CreateUserWorkoutRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userWorkoutExercise = req.body;

  try {
    const workout = await prisma.userWorkoutExercise.createMany({
      data: userWorkoutExercise,
    });
    res.status(201).json(workout);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
export const createUserWorkout = [...validate, createUserWorkoutHandler];

interface UserWorkoutIdRequest extends Request {
  params: {
    id: string;
  };
}

export const getUserWorkout = async (
  req: UserWorkoutIdRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      res.status(400).json("User not found");
      return;
    }
    const workout = await prisma.userWorkoutExercise.findMany({
      where: {
        id,
      },
      include: {
        user: true,
        category: true,
        workoutExercise: {
          include: {
            workout: true,
            exercise: true,
          },
        },
      },
    });
    res.status(200).json({ workout });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get workout exercises" });
  }
};

export const deleteUserWorkout = async (
  req: UserWorkoutIdRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const workoutExist = await prisma.userWorkoutExercise.findUnique({
      where: {
        id,
      },
    });
    if (!workoutExist) {
      res.status(400).json({ message: "Workout not found!" });
      return;
    }
    await prisma.userWorkoutExercise.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Workout deleted successifully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
};
