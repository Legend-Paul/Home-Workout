import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const validateUserHandle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.status(200).json({ message: "Login successful", userId: user });
  } catch (error) {
    console.error("Error during user validation:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const validateUser = [...validate, validateUserHandle];
export { validateUser };
