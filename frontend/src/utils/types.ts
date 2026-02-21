export type User = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "MASTER";
  goal?: "LOSE_WEIGHT" | "GAIN_MUSCLE" | "MAINTAIN_FITNESS";
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL";
  isBoarder: boolean;
  isVerified: boolean;
  onboardingStep: number;
  setupMethod: "QUICK_PLAN" | "CUSTOM";
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
  goal: "LOSE_WEIGHT" | "GAIN_MUSCLE" | "MAINTAIN_FITNESS";
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  dayOfWeek: number;
  dayName: string;
  muscleGroup: string[];
  isRestDay: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
