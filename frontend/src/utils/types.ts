export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
export type Goal = "LOSE_WEIGHT" | "GAIN_MUSCLE" | "MAINTAIN_FITNESS";
export type Role = "USER" | "ADMIN" | "MASTER";
export type SetupMethod = "QUICK_PLAN" | "CUSTOM";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  goal?: Goal;
  level?: Level;
  isBoarder: boolean;
  isVerified: boolean;
  onboardingStep: number;
  setupMethod: SetupMethod;
  createdAt: Date;
  updatedAt: Date;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
  muscleGroup: string[];
  equipment: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
};

export type QuickPlan = {
  id: string;
  name: string;
  goal: Goal;
  level: Level;
  dayOfWeek: number;
  dayName: string;
  muscleGroup: string[];
  isRestDay: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Plan = {
  id: string;
  name: string;
  goal: Goal;
  level: Level;
  isActive: boolean;
  totalExercises: number;
  activeDays: number;
};

export type WeeklyPlan = {
  id: string;
  quickStartPlanId: string;
  name: string;
  dayOfWeek: number;
  muscleGroup: string[];
  quickStartExercises?: WeeklyPlanExercise[];
  isRestDay: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface WeeklyPlanExercise {
  id: string;
  quickStartWeeklyPlanId: string;
  exerciseId: string;
  order: number;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
  quickStartWeeklyPlan?: WeeklyPlan;
  exercise?: Exercise;
}
