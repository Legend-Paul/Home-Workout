import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

interface WorkoutRequest extends Request {
  body: Array<{
    title: string;
    description: string;
    duration: number;
    categoryId: string;
  }>;
}

export const createWorkout = async (
  req: WorkoutRequest,
  res: Response
): Promise<void> => {
  const workouts = req.body;
  try {
    const workout = await prisma.workout.createMany({
      data: workouts,
    });
    res.status(201).json({ message: "Workouts created successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create workouts" });
  }
};
