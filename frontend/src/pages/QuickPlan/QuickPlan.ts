import styles from "./QuickPlan.module.css";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import type { Goal, Level } from "../../utils/types";
import { navigate } from "../../router";

interface Plan {
  id: string;
  name: string;
  goal: Goal;
  level: Level;
  isActive: boolean;
  totalExercises: number;
  activeDays: number;
}

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;
const token = localStorage.getItem("Authorization") || "";

export default async function QuickPlan() {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

  const plans = await fetchAllPlans();
  const planId = plans[0]?.id;

  mainApp!.innerHTML = `
  <div class="${styles["plans-container"]}">
    <div class="${styles["plans-quick-action-btn"]}">
      <div class="${styles["show-aside-btn"]} ${styles["toggle-aside-btn"]}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3-3 3m-4-6l3 3-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Show quick plans</p>
      </div>
      ${Button({
        label: `
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              <p>Weekly Plan</p>`,
        btnClass: styles["add-weekly-plan-btn"],
        data: `data-plan-id="${planId}"`,
      })}
    </div>
   ${renderQuickPlans(plans).outerHTML};
   ${renderQuickPlansExercises().outerHTML}
   <div class=""></div>
  </div>
      
  `;

  const addWeeklyPlanBtn = document.querySelector(
    `.${styles["add-weekly-plan-btn"]}`,
  ) as HTMLButtonElement;
  addWeeklyPlanBtn.addEventListener("click", () => {
    const planId = addWeeklyPlanBtn.dataset.planId;
    navigate(`/api/quick-plans/${planId}/weekly-plans/new?day=0`);
  });
}

// render quik plans
function renderQuickPlans(plans: Plan[]): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = `${styles["quick-plans-container"]} ${styles["hide"]}`;

  wrap!.innerHTML = `
      <div class="${styles["quick-plans-header"]}">
      <div class="${styles["toggle-aside-btn"]} ${styles["hide-aside-btn"]}">
          <svg fill="none" stroke="currentColor" 
              viewBox="0 0 24 24">
              <path stroke-linecap="round" 
              stroke-linejoin="round" stroke-width="2" 
              d="M11 15l-3-3 3-3m4 6l-3-3 3-3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Hide</p>
        </div>
        ${Button({
          label: `
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              <p>Add Plan</p>`,
          btnClass: styles["add-quick-plan-btn"],
        })}
      </div>
    
      <h2 class="${styles["quick-plans-heading"]}">Quick Plans</h2>
      <div class="${styles["quick-plans"]}">
      ${plans
        .map((plan: Plan) => {
          return `
            <div class="${styles["quick-plan"]}  ${styles["active-quick-plan"]}">
            <h3>${plan.name}</h3>
            <div class="${styles["quick-plan-summary"]}">
                <p>Exercises: ${plan.totalExercises}</p>
                <p>Days: ${plan.activeDays}</p>
            </div>
            <p class="${styles["quick-plan-level"]}">${plan.level}</p>   
        </div>
      </div>  
          `;
        })
        .join("")}  
  `;
  return wrap;
}

// render quick plans exercises
function renderQuickPlansExercises(): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = `${styles["quick-weekly-plans-container"]}`;

  wrap.innerHTML = `
    <div class="${styles["weekly-plan"]} ${styles["rest-day"]}">
      <div class="${styles["weekly-plan-heading"]}">
        <h3>Rest Day</h3>
        <p>Sunday</p>
      </div>
    </div>

    <div class="${styles["weekly-plan"]}">
      <div class="${styles["weekly-plan-heading"]}">
        <h3>Leg day</h3>
        <p>Sunday</p>
      </div>
      <p>Exercises: 4</p>
      <div class="${styles["muscle-group"]}">
        <p>Shoulder Traps Triceps</p>
      </div>
    </div>
  `;
  return wrap;
}

// Add quick plan button
function addQuickPlanHandler(container: HTMLDivElement) {
  const addQuickPlanBtn = container?.querySelector(
    `.${styles["add-quick-plan-btn"]}`,
  ) as HTMLButtonElement;
  addQuickPlanBtn.addEventListener("click", () => {
    navigate("/api/quick-plans/new");
  });
}

// toggle exercise
function toggleQuickPlan(container: HTMLDivElement) {
  const hideAsideBtn = container!.querySelector(
    `.${styles["hide-aside-btn"]}`,
  ) as HTMLDivElement;
  const showAsideBtn = container!.querySelector(
    `.${styles["show-aside-btn"]}`,
  ) as HTMLDivElement;
  const quickPlanContainer = container!.querySelector(
    `.${styles["quick-plans-container"]}`,
  ) as HTMLDivElement;

  showAsideBtn.addEventListener("click", () => {
    quickPlanContainer.classList.replace(
      `${styles["hide"]}`,
      `${styles["show"]}`,
    );
  });

  hideAsideBtn.addEventListener("click", () => {
    quickPlanContainer.classList.replace(
      `${styles["show"]}`,
      `${styles["hide"]}`,
    );
  });
}

async function fetchAllPlans() {
  try {
    const response = await fetch(`${backendUrl}/api/quick-plans`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      const data = await response.json();
      Notification({
        message: data.error || "Failed to fetch exercises",
        type: "error",
        duration: 5000,
      });
    }
    const data = await response.json();
    return data.plans;
  } catch (error) {
    return [];
  }
}
