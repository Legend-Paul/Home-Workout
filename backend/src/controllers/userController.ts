import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// Update user username and email
const validateUsername = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

interface UsernameRequest extends Request {
  body: {
    username: string;
    password: string;
  };
  params: { id: string };
}

export const updateUsename = [
  ...validateUsername,
  async (req: UsernameRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const isPassword = await bcrypt.compare(password, user.password);

      if (!isPassword) {
        res.status(401).json({ error: "Incorrect password" });
        return;
      }

      const updatedData = { username };

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updatedData,
      });
      res.status(200).json({
        message: "User information updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user information:", error);
      res.status(500).json({ error: "Failed to update user information" });
    }
  },
];
