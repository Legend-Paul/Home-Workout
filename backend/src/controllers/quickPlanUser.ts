import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

// Validation
const validate = [
  body("quickStartPlanId")
    .trim()
    .isUUID()
    .withMessage("QuickStartPlanId must be a uuid"),
];

// Create QuickPlanUser - enroll user in a quick start plan
interface CreateQuickPlanUserRequest extends Request {
  body: {
    quickStartPlanId: string;
  };
}

const createQuickPlanUserHandler = async (
  req: CreateQuickPlanUserRequest,
  res: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const userId = req.user!.id;
  const { quickStartPlanId } = req.body;

  try {
    const plan = await prisma.quickStartPlan.findUnique({
      where: { id: quickStartPlanId },
    });

    if (!plan) {
      res.status(404).json({ error: "Quick start plan not found" });
      return;
    }

    const enrollmentExists = await prisma.quickPlanUser.findUnique({
      where: { userId_quickStartPlanId: { userId, quickStartPlanId } },
    });

    if (enrollmentExists) {
      res.status(400).json({ error: "You are already enrolled in this plan" });
      return;
    }

    const enrollment = await prisma.quickPlanUser.create({
      data: { userId, quickStartPlanId },
    });

    res
      .status(201)
      .json({ message: "Enrolled in plan successfully", enrollment });
  } catch (error) {
    console.error("Error enrolling in quick start plan:", error);
    res.status(500).json({ error: "Failed to enroll in quick start plan" });
  }
};

export const createQuickPlanUser = [...validate, createQuickPlanUserHandler];

// Get all QuickPlanUsers for logged in user
export const getQuickPlanUsers = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const enrollments = await prisma.quickPlanUser.findMany({
      where: { userId, isActive: true },
      include: {
        quickStartPlan: {
          include: {
            quickStartWeeklyPlan: {
              include: {
                _count: {
                  select: { quickStartExercises: true },
                },
              },
            },
          },
        },
      },
    });

    const formattedEnrollments = enrollments.map((enrollment) => {
      const activeDays = enrollment.quickStartPlan.quickStartWeeklyPlan.filter(
        (day) => !day.isRestDay,
      );
      const totalExercises =
        enrollment.quickStartPlan.quickStartWeeklyPlan.reduce(
          (sum, day) => sum + day._count.quickStartExercises,
          0,
        );

      return {
        id: enrollment.id,
        isActive: enrollment.isActive,
        enrolledAt: enrollment.createdAt,
        plan: {
          id: enrollment.quickStartPlan.id,
          name: enrollment.quickStartPlan.name,
          goal: enrollment.quickStartPlan.goal,
          level: enrollment.quickStartPlan.level,
          activeDays: activeDays.length,
          totalExercises,
        },
      };
    });

    res.status(200).json({ enrollments: formattedEnrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

const updateValidate = [
  body("isActive")
    .toBoolean()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// Create QuickPlanUser - enroll user in a quick start plan
interface UpdateQuickPlanUserRequest extends Request {
  body: {
    isActive: boolean;
  };
  params: {
    id: string;
  };
}

// Update QuickPlanUser - toggle isActive
const updateQuickPlanUserHandler = async (
  req: UpdateQuickPlanUserRequest,
  res: Response,
) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { isActive } = req.body;

  try {
    const enrollment = await prisma.quickPlanUser.findUnique({
      where: { id },
    });

    if (!enrollment) {
      res.status(404).json({ error: "Enrollment not found" });
      return;
    }

    if (enrollment.userId !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const updatedEnrollment = await prisma.quickPlanUser.update({
      where: { id },
      data: { isActive },
    });

    res
      .status(200)
      .json({
        message: "Enrollment updated successfully",
        enrollment: updatedEnrollment,
      });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({ error: "Failed to update enrollment" });
  }
};

export const updateQuickPlanUser = [
  ...updateValidate,
  updateQuickPlanUserHandler,
];
