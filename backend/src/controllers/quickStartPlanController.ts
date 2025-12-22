import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [];

// Create createQuickStartPlan handler
const createQuickStartPlanHandler = async (
  req: Request,
  res: Response
): Promise<void> => {};
export const createcreateQuickStartPlan = [
  ...validate,
  createQuickStartPlanHandler,
];
