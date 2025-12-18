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
  body("category").trim().isString().withMessage("Category must be a string"),
  body("videoUrl")
    .optional()
    .isString()
    .withMessage("Video URL must be a string"),
  body("difficulty")
    .optional()
    .isString()
    .withMessage("Difficulty must be a string"),
];

interface ExerciseRequest extends Request {
  body: {
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    videoUrl?: string;
    difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  };
}

const createExerciseHandler = async (
  req: ExerciseRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { name, description, imageUrl, category, videoUrl, difficulty } =
    req.body;
  try {
    const [categoryExists, exerciseExists] = await Promise.all([
      prisma.category.findUnique({
        where: { name: category },
      }),
      prisma.exercise.findUnique({
        where: { name },
      }),
    ]);
    if (!categoryExists) {
      res.status(400).json({ error: "Category does not exist" });
      return;
    }
    if (exerciseExists) {
      res.status(400).json({ error: "Exercise with this name already exists" });
      return;
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        imageUrl,
        categoryId: categoryExists.id,
        videoUrl: videoUrl || null,
        difficulty: difficulty || null,
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
export const createExercise = [...validate, createExerciseHandler];

export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        categories: true,
      },
    });
    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};
