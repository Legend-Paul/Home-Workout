import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("name").trim().isString().withMessage("Name must be a string"),
  body("description")
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("imageUrl").trim().isString().withMessage("Image URL must be a string"),
  body("videoUrl")
    .optional()
    .isString()
    .withMessage("Video URL must be a string"),
  body("level")
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"])
    .withMessage("Level must be a string"),
  body("muscleGroup")
    .isArray({ min: 1 })
    .withMessage("Muscle groups must be an array"),
  body("equipment")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Equipment must be an array"),
];

interface ExerciseRequest extends Request {
  body: {
    name: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
    muscleGroup: string[];
    equipment?: string[];
  };
}

// Create exercise handler
const createExerciseHandler = async (
  req: ExerciseRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const {
    name,
    description,
    imageUrl,
    videoUrl,
    level,
    muscleGroup,
    equipment,
  } = req.body;

  try {
    const exerciseExists = await prisma.exercise.findUnique({
      where: { name },
    });

    if (exerciseExists) {
      res.status(400).json({ error: "Exercise with this name already exists" });
      return;
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        imageUrl,
        videoUrl: videoUrl || null,
        level: level || null,
        muscleGroup: muscleGroup,
        equipment: equipment || [],
      },
    });

    res
      .status(201)
      .json({ message: "Exercise created successfully", exercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create exercise" });
  }
};

// create exercise
export const createExercise = [...validate, createExerciseHandler];

// Get all exercises
export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};
