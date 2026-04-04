import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import type { WeeklyPlan, WeeklyPlanExercise } from "../../utils/types";
import styles from "./Weeklyplan.module.css";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;
const token = localStorage.getItem("Authorization") || "";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const authHeaders = () => {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
};

interface PageState {
  id: string;
  planId: string;
  weeklyPlan: WeeklyPlan | null;
  weeklyPlans: WeeklyPlan[] | null;
}

export default async function WeeklyPlan(params?: Record<string, string>) {
  const mainApp = document.getElementById("main-app")!;

  const { planId, id } = params || { planId: "", id: "" };

  const plan = await fetchWeeklyPlanById(planId, id);
  const weeklyPlans = await fetchAllWeeklyPlans(planId);
  const weeklyPlan: WeeklyPlan | null =
    weeklyPlans?.find((plan) => plan.id === id) || null;

  console.log("Fetched weekly plan:", weeklyPlan);
  console.log("Fetched all weekly plans:", weeklyPlans);

  const state: PageState = {
    id,
    planId,
    weeklyPlan,
    weeklyPlans,
  };
  mainApp!.innerHTML = `
      <div class="${styles["weekly-plan-container"]}">
        <div class="${styles["weekly-plan-header"]}">
          <div class="${styles["header-left"]}">
            ${Button({
              label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                      Back`,
              btnClass: styles["back-btn"],
            })}
            <h2 class="${styles["page-heading"]}">${plan?.name || "Weekly"} Plan</h2>
          </div>
          <div class="${styles["plan-header-btns"]}">
            ${Button({
              label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Add Exercise`,
              btnClass: styles["add-weekly-plan-exercise-btn"],
            })}
          </div>
        </div>

        <div class="${styles["day-tabs-wrapper"]}">
          <div class="${styles["day-tabs"]}">
            ${renderDayTabs(state.weeklyPlan!)}
          </div>
        </div>
      </div>`;
}

function renderDayTabs(weeklyPlan: WeeklyPlan): string {
  return DAYS.map((day) => {
    const hasExercises = weeklyPlan?.quickStartExercises
      ? weeklyPlan?.quickStartExercises.some(
          (weeklyPlanExercise: WeeklyPlanExercise) =>
            weeklyPlanExercise?.exercises
              ? weeklyPlanExercise?.exercises.length > 0
              : false,
        )
      : false;
    const isActive = weeklyPlan.isRestDay;
    return `
    ${Button({
      label: `${day}
        ${hasExercises ? `<span class="${styles["day-dot"]}"></span>` : ""}`,
      btnClass: `${styles["day-tab"]} ${isActive ? styles["day-tab--active"] : ""}`,
      data: `data-day="${day}"`,
    })}
      `;
  }).join("");
}

async function fetchWeeklyPlanById(
  planId: string,
  id: string,
): Promise<WeeklyPlan | null> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    const json = await response.json();
    if (!response.ok) {
      Notification({
        message: json.error ?? "Failed to fetch exercises.",
        type: "error",
        duration: 5000,
      });
    }
    return json.weeklyPlan;
  } catch (error) {
    return null;
  }
}
async function fetchAllWeeklyPlans(
  planId: string,
): Promise<WeeklyPlan[] | null> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    const json = await response.json();
    if (!response.ok) {
      Notification({
        message: json.error ?? "Failed to fetch exercises.",
        type: "error",
        duration: 5000,
      });
    }
    return json.weeklyPlans;
  } catch (error) {
    return null;
  }
}
