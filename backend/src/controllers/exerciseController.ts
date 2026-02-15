import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("name").trim().isString().withMessage("Name must be a string"),
  body("description")
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("level")
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"])
    .withMessage("Level must be BEGINNER, INTERMEDIATE, ADVANCED, or ALL"),
  body("muscleGroup")
    .isArray({ min: 1 })
    .withMessage("Muscle groups must be an array with at least one item"),
  body("equipment")
    .optional()
    .isArray({ min: 0 })
    .withMessage("Equipment must be an array"),
];

interface ExerciseRequest extends Request {
  body: {
    name: string;
    description: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
    muscleGroup: string[];
    equipment?: string[];
  };
}

// Create exercise handler
const createExerciseHandler = async (
  req: ExerciseRequest,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Get uploaded files
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFile = files?.image?.[0];
  const videoFile = files?.video?.[0];

  // Validate that image is uploaded (required)
  if (!imageFile) {
    res.status(400).json({ error: "Image is required" });
    return;
  }

  const { name, description, level, muscleGroup, equipment } = req.body;

  try {
    const exerciseExists = await prisma.exercise.findUnique({
      where: { name },
    });

    if (exerciseExists) {
      res.status(400).json({ error: "Exercise with this name already exists" });
      return;
    }

    // Build file URLs (adjust path based on your server setup)
    const imageUrl = `/uploads/${imageFile.filename}`;
    const videoUrl = videoFile ? `/uploads/${videoFile.filename}` : null;

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        imageUrl,
        videoUrl,
        level,
        muscleGroup: Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup],
        equipment: equipment || [],
      },
    });

    res.status(201).json({
      message: "Exercise created successfully",
      exercise: {
        ...exercise,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
      },
    });
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ error: "Failed to create exercise" });
  }
};

// Create exercise
export const createExercise = [...validate, createExerciseHandler];

// Get all exercises
export const getAllExercises = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

// Get exercise by ID
interface GetExerciseByIdRequest extends Request {
  params: {
    id: string;
  };
}

export const getExerciseById = async (
  req: GetExerciseByIdRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise || !exercise.isActive) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    res.status(200).json({ exercise });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
};

// Update exercise handler
interface UpdateExerciseRequest extends ExerciseRequest {
  params: {
    id: string;
  };
}

const updateExerciseHandler = async (
  req: UpdateExerciseRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // Get uploaded files
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFile = files?.image?.[0];
  const videoFile = files?.video?.[0];

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise || !exercise.isActive) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    // Build file URLs (adjust path based on your server setup)
    const imageUrl = imageFile
      ? `/uploads/${imageFile.filename}`
      : exercise.imageUrl;
    const videoUrl = videoFile
      ? `/uploads/${videoFile.filename}`
      : exercise.videoUrl;

    const { name, description, level, muscleGroup, equipment } = req.body;

    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        videoUrl,
        level,
        muscleGroup: Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup],
        equipment: equipment || [],
      },
    });

    res.status(200).json({
      message: "Exercise updated successfully",
      exercise: {
        ...updatedExercise,
        imageUrl,
        videoUrl,
      },
    });
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ error: "Failed to update exercise" });
  }
};
// Update exercise
export const updateExercise = [...validate, updateExerciseHandler];

// Deactivate exercise (soft delete)
interface DeactivateExerciseRequest extends Request {
  params: {
    id: string;
  };
}

export const deactivateExercise = async (
  req: DeactivateExerciseRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise || !exercise.isActive) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    await prisma.exercise.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(200).json({ message: "Exercise deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating exercise:", error);
    res.status(500).json({ error: "Failed to deactivate exercise" });
  }
};

// Activate exercise
interface ActivateExerciseRequest extends Request {
  params: {
    id: string;
  };
}

export const activateExercise = async (
  req: ActivateExerciseRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }

    await prisma.exercise.update({
      where: { id },
      data: { isActive: true },
    });

    res.status(200).json({ message: "Exercise activated successfully" });
  } catch (error) {
    console.error("Error activating exercise:", error);
    res.status(500).json({ error: "Failed to activate exercise" });
  }
};
