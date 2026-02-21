import styles from "./Home.module.css";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { type User, type Exercise, type QuickPlan } from "../../utils/types";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

export default async function AdminHome() {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

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
      <div class="${styles["admin-summary"]}">
        <article class="${styles["summary-card"]} ${styles["user-card"]}">
          <h3>Users</h3>
          <div class="${styles["summary-status"]}">
            <p class="${styles["active-summary-count"]}">Active: ${activeUsers}</p>
            <p class="${styles["inactive-summary-count"]}">Inactive: ${inactiveUsers}</p> 
            <p class="${styles["total-summary-count"]}">Total: ${userCount}</p>         
          </div>
        </article>
        <article class="${styles["summary-card"]} ${styles["admin-card"]}">
          <h3>Admins</h3>
          <div class="${styles["summary-status"]}">
            <p class="${styles["active-summary-count"]}">Active: ${activeAdmins}</p>
            <p class="${styles["inactive-summary-count"]}">Inactive: ${inactiveAdmins}</p> 
            <p class="${styles["total-summary-count"]}">Total: ${adminCount}</p>         
          </div>
        </article>
        <article class="${styles["summary-card"]} ${styles["exercise-card"]}">
          <h3>Exercises</h3>
          <div class="${styles["summary-status"]}">
            <p class="${styles["active-summary-count"]}">Active: ${activeExercises}</p>
            <p class="${styles["inactive-summary-count"]}">Inactive: ${inactiveExercises}</p> 
            <p class="${styles["total-summary-count"]}">Total: ${exerciseCount}</p>         
          </div>          
        </article>
        <article class="${styles["summary-card"]} ${styles["quick-plan-card"]}">
          <h3>Quick Plans</h3>          
          <div class="${styles["summary-status"]}">
            <p class="${styles["active-summary-count"]}">Active: ${activeQuickPlans}</p>
            <p class="${styles["inactive-summary-count"]}">Inactive: ${inactiveQuickPlans}</p> 
            <p class="${styles["total-summary-count"]}">Total: ${quickPlanCount}</p>         
          </div>          
        </article>
      </div>
      ${Button({
        label: `
        <svg class="${styles["add-exercise-btn-icon"]}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
        </path></svg>
        <p class="${styles["add-exercise-btn-text"]}"> Add Exercise </p>`,
        btnClass: styles["add-exercise-btn"],
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
