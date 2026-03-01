import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      omit: { password: true },
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// update validate
const updateValidate = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("goal")
    .trim()
    .isIn(["BUILD_MUSCLE", "LOSE_FAT", "MAINTAIN_FITNESS"])
    .withMessage("Invalid goal"),
  body("level")
    .trim()
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL"])
    .withMessage("Invalid level"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

// update user
interface UpdatRequest extends Request {
  params: { id: string };
  body: {
    goal: "BUILD_MUSCLE" | "LOSE_FAT" | "MAINTAIN_FITNESS";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
    username: string;
    password: string;
  };
}

export const updateUser = [
  ...updateValidate,
  async (req: UpdatRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, goal, level, password } = req.body;
    const userId = req.params.id;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(404).json({ error: "Invalid password" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(username && { username }),
          ...(goal && { goal }),
          ...(level && { level }),
        },
      });

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user level:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  },
];
