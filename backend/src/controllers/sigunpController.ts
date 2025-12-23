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
      res.status(409).json({ error: "User with this email already exists" });
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
    res.status(500).json({ message: "Failed to create user" });
  }
};
export const createUser = [...validate, createUserHandler];
