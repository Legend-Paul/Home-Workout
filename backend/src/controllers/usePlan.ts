import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation
const validate = [
  body("name").isString().trim().withMessage("Name must be a string"),
];

interface CreateUserPlan extends Request {
  body: {
    name: string;
  };
}

// Create UserPlan
const createUserPlanHandler = async (req: CreateUserPlan, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name } = req.body;
  const userId = req.user!.id;

  try {
    const planExists = await prisma.userPlan.findUnique({
      where: { userId_name: { userId, name } },
    });

    if (planExists) {
      res.status(400).json({ error: "Plan with that name already exists" });
      return;
    }

    const plan = await prisma.userPlan.create({
      data: { name, userId },
    });

    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    console.error("Error creating user plan:", error);
    res.status(500).json({ error: "Failed to create user plan" });
  }
};

export const createUserPlan = [...validate, createUserPlanHandler];
