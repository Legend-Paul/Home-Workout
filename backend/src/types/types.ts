import { Prisma } from "@prisma/client";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MASTER = "MASTER",
}

export enum Goal {
  BUILD_MUSCLE = "BUILD_MUSCLE",
  LOSE_FAT = "LOSE_FAT",
  MAINTAIN_FITNESS = "MAINTAIN_FITNESS",
  ALL = "ALL",
}

export enum Level {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  ALL = "ALL",
}

export enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
  REST = "REST",
}

export enum SetupMethod {
  QUICK_START = "QUICK_START",
  CUSTOM = "CUSTOM",
}

export enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  BLOCKED = "BLOCKED",
}

// ============================================================
// Models
// ============================================================

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  goal: Goal | null;
  level: Level | null;
  role: Role;
  isBoarded: boolean;
  isVerified: boolean;
  onboardingStep: number;
  setupMethod: SetupMethod;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  verificationToken?: VerificationToken[];
  passwordResetToken?: PasswordResetToken[];
  calendarEntries?: CalendarEntry[];
  exercisesCreated?: Exercise[];
  userPlans?: UserPlan[];
  quickStartPlans?: QuickStartPlan[];
  quickPlanUsers?: QuickPlanUser[];
  friendsInitiated?: Friendship[];
  friendsReceived?: Friendship[];
}

export interface VerificationToken {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userId: string;

  // Relations
  user?: User;
}

export interface PasswordResetToken {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userId: string;

  // Relations
  user?: User;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl: string | null;
  level: Level;
  muscleGroup: string[];
  equipment: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;

  // Relations
  createdByUser?: User | null;
  quickStartExercises?: QuickStartExercise[];
  weeklyPlanExercises?: WeeklyPlanExercise[];
}

export interface QuickStartPlan {
  id: string;
  name: string;
  goal: Goal;
  level: Level;
  isActive: boolean;
  createdBy: string | null;

  // Relations
  createdByUser?: User | null;
  quickStartWeeklyPlan?: QuickStartWeeklyPlan[];
  quickPlanUsers?: QuickPlanUser[];
}

export interface QuickStartWeeklyPlan {
  id: string;
  quickStartPlanId: string;
  name: string;
  dayOfWeek: number;
  muscleGroup: string[];
  isRestDay: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  quickStartExercises?: QuickStartExercise[];
  quickStartPlan?: QuickStartPlan;
}

export interface QuickStartExercise {
  id: string;
  quickStartWeeklyPlanId: string;
  exerciseId: string;
  order: number;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  quickStartWeeklyPlan?: QuickStartWeeklyPlan;
  exercise?: Exercise;
}

export interface QuickPlanUser {
  id: string;
  userId: string;
  quickStartPlanId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  quickStartPlan?: QuickStartPlan;
  user?: User;
}

export interface UserPlan {
  id: string;
  name: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  weeklyPlan?: WeeklyPlan[];
  user?: User;
}

export interface WeeklyPlan {
  id: string;
  userPlanId: string;
  name: string;
  dayOfWeek: number;
  muscleGroup: string[];
  isRestDay: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userPlan?: UserPlan;
  weeklyPlanExercises?: WeeklyPlanExercise[];
  calendarEntries?: CalendarEntry[];
}

export interface WeeklyPlanExercise {
  id: string;
  weeklyPlanId: string;
  exerciseId: string;
  order: number;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  weeklyPlan?: WeeklyPlan;
  exercise?: Exercise;
}

export interface CalendarEntry {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  timeUsed: number | null;
  status: Status;
  userId: string;
  weeklyPlanId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  weeklyPlan?: WeeklyPlan | null;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  createdAt: Date;

  // Relations
  user?: User;
  friend?: User;
}

export type EnrollmentWithPlan = Prisma.QuickPlanUserGetPayload<{
  include: {
    quickStartPlan: {
      include: {
        quickStartWeeklyPlan: {
          include: {
            _count: {
              select: { quickStartExercises: true };
            };
          };
        };
      };
    };
  };
}>;

export type WeeklyPlanWithCount = Prisma.QuickStartWeeklyPlanGetPayload<{
  include: {
    _count: {
      select: { quickStartExercises: true };
    };
  };
}>;

export type PlanWithWeeklyCount = Prisma.QuickStartPlanGetPayload<{
  include: {
    quickStartWeeklyPlan: {
      include: {
        _count: {
          select: { quickStartExercises: true };
        };
      };
    };
  };
}>;

export type QuickStartWeeklyPlanWithCount =
  PlanWithWeeklyCount["quickStartWeeklyPlan"][number];

export type UserPlanWithWeekly = Prisma.UserPlanGetPayload<{
  include: {
    weeklyPlan: {
      include: {
        _count: {
          select: { weeklyPlanExercises: true };
        };
      };
    };
  };
}>;

export type UserPlanWeeklyPlanWithCount =
  UserPlanWithWeekly["weeklyPlan"][number];
