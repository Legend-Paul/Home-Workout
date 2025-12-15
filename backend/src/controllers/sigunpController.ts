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
  body("level")
    .trim()
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .withMessage("Invalid level"),
  body("goal")
    .trim()
    .isIn(["BUILD_MUSCLE", "LOSE_FAT", "MAINTAIN_FITNESS", "OTHER"])
    .withMessage("Invalid goal"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
interface Data {
  email: string;
  username: string;
  password: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  goal: "BUILD_MUSCLE" | "LOSE_FAT" | "MAINTAIN_FITNESS" | "OTHER";
}

const createUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, username, level, goal, password }: Data = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        level,
        goal,
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
const createUser = [...validate, createUserHandler];

export { createUser };
