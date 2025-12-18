import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const createExerciseHandler = async (
  req: Request,
  res: Response
): Promise<void> => {};
export const createExercise = async (req: Request, res: Response) => {};

export const getAllExercises = async (req: Request, res: Response) => {};
