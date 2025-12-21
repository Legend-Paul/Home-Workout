import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

const validate = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

// Create User Controller
interface UserRequest extends Request {
  body: {
    email: string;
    username: string;
    password: string;
  };
}

const createUserHandler = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user already exists
    if (userExist) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const createUser = [...validate, createUserHandler];

// Update User Goal Controller
const vidateGoal = [
  body("goal")
    .trim()
    .isIn(["BUILD_MUSCLE", "LOSE_FAT", "MAINTAIN_FITNESS", "OTHER"])
    .withMessage("Invalid goal"),
];

interface GoalRequest extends Request {
  params: { id: string };
  body: {
    goal: "BUILD_MUSCLE" | "LOSE_FAT" | "MAINTAIN_FITNESS" | "OTHER";
  };
}

export const updateGoal = [
  ...vidateGoal,
  async (req: GoalRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { goal } = req.body;
    const userId = req.params.id;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { goal, onboardingStep: 1 },
      });
      res
        .status(200)
        .json({ message: "User goal updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user goal:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Updated user level
const validateLevel = [
  body("level")
    .trim()
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .withMessage("Invalid level"),
];

interface LevelRequest extends Request {
  params: { id: string };
  body: {
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  };
}

export const updateLevel = [
  ...validateLevel,
  async (req: LevelRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { level } = req.body;
    const userId = req.params.id;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { level, onboardingStep: 2 },
      });
      res
        .status(200)
        .json({
          message: "User level updated successfully",
          user: updatedUser,
        });
    } catch (error) {
      console.error("Error updating user level:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
