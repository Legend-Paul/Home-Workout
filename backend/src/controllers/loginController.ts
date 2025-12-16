import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import "dotenv/config";

const validate = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

interface Data {
  email: string;
  password: string;
}

const validateUserHandle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { email, password }: Data = req.body;
  try {
    console.log(email);
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

    const userWithoutPassword = { ...user, password: undefined };
    const token = jwt.sign(
      userWithoutPassword,
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7days",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: `Bearer ${token}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error during user validation:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const validateUser = [...validate, validateUserHandle];
export { validateUser };
