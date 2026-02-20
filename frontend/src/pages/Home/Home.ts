import styles from "./Home.module.css";
import Button from "../../components/Button/Button";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

type User = {
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

type Exercise = {
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

type QuickPlan = {
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

export default async function AdminHome() {
  const mainApp = document.getElementById("main-app");

  const [users, exercises, quickPlans] = await Promise.all([
    fetchUsers(),
    fetchExercises(),
    fetchQuickPlans(),
  ]);
  console.log("Users:", users);
  console.log("Exercises:", exercises);
  console.log("Quick Plans:", quickPlans);

  // Total counts
  const userCount = users.length;
  const exerciseCount = exercises.length;
  const quickPlanCount = quickPlans.length;
  const adminCount = users.filter(
    (user: User) => user.role === "ADMIN" || user.role === "MASTER",
  ).length;

  // Active
  const activeUsers = users.filter((user: User) => user.isVerified).length;
  const activeExercises = exercises.filter(
    (exercise: Exercise) => exercise.isActive,
  ).length;
  const activeQuickPlans = quickPlans.filter(
    (plan: QuickPlan) => plan.isActive,
  ).length;
  const activeAdmins = users.filter(
    (user: User) =>
      (user.role === "ADMIN" || user.role === "MASTER") && user.isVerified,
  ).length;

  // Inactive
  const inactiveUsers = userCount - activeUsers;
  const inactiveExercises = exerciseCount - activeExercises;
  const inactiveQuickPlans = quickPlanCount - activeQuickPlans;
  const inactiveAdmins = adminCount - activeAdmins;

  mainApp!.innerHTML = `
    <div class="${styles["home-container"]}">
      <div class="${styles["admin-header"]}">
        <h2>Admin Dashboard</h2>
        <p>Consistency is more important than perfection.
        </p>
        <!-- <p>It’s a slow process, but quitting won’t speed it up.</p> -->
      </div>
      <div class="${styles["admin-links"]}">
        <article class="${styles["summary-card"]} ${styles["user-card"]}">
          <h3>Manage Users</h3>
          <div class="${styles["summary-status"]}">
            <p>Active: ${activeUsers}</p>
            <p>Inactive: ${inactiveUsers}</p> 
            <p>Total: ${userCount}</p>         
          </div>
        </article>
        <article class="${styles["summary-card"]} ${styles["admin-card"]}">
          <h3>Admins</h3>
          <div class="${styles["summary-status"]}">
            <p>Active: ${activeAdmins}</p>
            <p>Inactive: ${inactiveAdmins}</p> 
            <p>Total: ${adminCount}</p>         
          </div>
        </article>
        <article class="${styles["summary-card"]} ${styles["exercise-card"]}">
          <h3>Exercises</h3>
          <div class="${styles["summary-status"]}">
            <p>Active: ${activeExercises}</p>
            <p>Inactive: ${inactiveExercises}</p> 
            <p>Total: ${exerciseCount}</p>         
          </div>          
        </article>
        <article class="${styles["summary-card"]} ${styles["plan-card"]}">
          <h3>Quick Plans</h3>          
          <div class="${styles["summary-status"]}">
            <p>Active: ${activeQuickPlans}</p>
            <p>Inactive: ${inactiveQuickPlans}</p> 
            <p>Total: ${quickPlanCount}</p>         
          </div>          
        </article>
      </div>
      ${Button({
        label: `<p> + </p><p> Add Exercise </p>`,
      })}
      
    </div>
  `;
}

async function fetchUsers() {
  try {
    const response = await fetch(`${backendUrl}/api/user/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function fetchExercises() {
  try {
    const response = await fetch(`${backendUrl}/api/exercise`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }
    const data = await response.json();
    return data.exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}

async function fetchQuickPlans() {
  try {
    const response = await fetch(`${backendUrl}/api/quick-plan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch quick plans");
    }
    const data = await response.json();
    return data.plans;
  } catch (error) {
    console.error("Error fetching quick plans:", error);
    return [];
  }
}
