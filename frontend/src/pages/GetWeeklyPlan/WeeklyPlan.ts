import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import { navigate } from "../../router";
import type { WeeklyPlan } from "../../utils/types";
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

  // const plan = await fetchWeeklyPlanById(planId, id);
  const weeklyPlans = await fetchAllWeeklyPlans(planId);
  const weeklyPlan: WeeklyPlan | null =
    weeklyPlans?.find((plan) => plan.id === id) || null;

  const state: PageState = {
    id,
    planId,
    weeklyPlan,
    weeklyPlans,
  };
  mainApp!.innerHTML = `
      <div class="${styles["weekly-plan-container"]}"></div>`;
  updatePage(state);
}

function updatePage(state: PageState) {
  const container = document.querySelector(
    `.${styles["weekly-plan-container"]}`,
  )! as HTMLDivElement;
  container.innerHTML = renderWeeklyPlan(state);
  attachEventHandlers(container, state);
}

function renderWeeklyPlan(state: PageState) {
  return `
    <div class="${styles["weekly-plan-content"]}">
      <div class="${styles["weekly-plan-header"]}">
        <div class="${styles["header-left"]}">
          ${Button({
            label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back`,
            btnClass: styles["back-btn"],
          })}
          <h2 class="${styles["page-heading"]}">${state.weeklyPlan?.name || "Weekly"} Plan</h2>
        </div>
        <div class="${styles["plan-header-btns"]}">
          ${Button({
            label: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg> Edit Plan`,
            btnClass: styles["edit-weekly-plan-exercise-btn"],
          })}
        </div>

        </div>
        <div class="${styles["day-tabs-wrapper"]}">  
          ${renderDayTabs(state).outerHTML}
        </div>
        <div class="${styles["weekly-plan-content-container"]}">
          ${
            renderExerciseCards(
              state.weeklyPlan ? [state.weeklyPlan] : (state.weeklyPlans ?? []),
            ).outerHTML
          }
        </div>
    </div>  
  `;
}

//
function renderDayTabs(state: PageState): HTMLDivElement {
  const dayTabs = document.createElement("div");
  dayTabs.className = styles["day-tabs"];
  dayTabs.innerHTML = state.weeklyPlans
    ? state.weeklyPlans
        ?.map((weeklyPlan) => {
          const day = DAYS[weeklyPlan.dayOfWeek];
          const isActive = state.weeklyPlan?.dayOfWeek === weeklyPlan.dayOfWeek;
          const isRestDay = weeklyPlan?.isRestDay;

          return `
    ${Button({
      label: `${day.slice(0, 3)}
       `,
      btnClass: `${styles["day-tab"]} ${isActive ? styles["day-tab--active"] : ""} 
        ${isRestDay ? styles["day-tab--rest"] : ""} `,
      data: `data-day="${day}" data-id="${weeklyPlan.id}"`,
    })}
      `;
        })
        .join("")
    : "";
  return dayTabs;
}

// render exercise cards
function renderExerciseCards(weeklyPlans: WeeklyPlan[]): HTMLDivElement {
  const exerciseCards = document.createElement("div");
  exerciseCards.className = styles["exercise-cards"];

  exerciseCards.innerHTML = weeklyPlans
    .map((weeklyPlan) => {
      const activeDay = DAYS[weeklyPlan.dayOfWeek];

      return `
      <div class="${styles["exercise-cards-header"]}">
        <div class="${styles["day-label"]}">
          <span>
          ${
            activeDay ===
            new Date().toLocaleDateString("en-US", { weekday: "long" })
              ? "Today · "
              : ""
          }${activeDay}</span>
          <span class="${styles["exercise-count"]}">
          ${(weeklyPlan.quickStartExercises ?? []).length} 
          exercise${(weeklyPlan.quickStartExercises ?? []).length !== 1 ? "s" : ""}</span>
        </div>
        ${Button({
          label: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg> Add Exercise`,
          data: `data-day="${activeDay}" data-id="${weeklyPlan.id}"`,
          btnClass: styles["add-exercise-btn"],
        })}
      </div>
      <div class="${styles["weekly-plan-exercises"]}">
        ${
          weeklyPlan.isRestDay
            ? renderRestDayCard().outerHTML
            : renderExercisesForDay(weeklyPlan).outerHTML
        }
      </div>
    `;
    })
    .join("");
  return exerciseCards;
}

// render rest day card
function renderRestDayCard(): HTMLDivElement {
  const emptyState = document.createElement("div");
  emptyState.className = `${styles["empty-state"]}`;
  emptyState.innerHTML = `
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>Rest day — no exercises scheduled</p>
        <button class="${styles["add-rest-day-btn"]}">Add Exercise</button>
      `;
  return emptyState;
}

// render exercise cards when clicking on day tab
function renderExercisesForDay(weeklyPlan: WeeklyPlan): HTMLDivElement {
  const exercisesContainer = document.createElement("div");
  exercisesContainer.className = `${styles["exercise-cards"]}`;

  (weeklyPlan.quickStartExercises ?? [])
    .map((quickStart) => {
      const ex = quickStart.exercise!;
      const metaLine = [
        quickStart.sets ? `${quickStart.sets} sets` : null,
        quickStart.reps ? `${quickStart.reps} reps` : null,
        quickStart.duration ? `${quickStart.duration}s` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const exerciseContainer = document.createElement("div");
      exerciseContainer.className = `${styles["exercise-card"]}`;

      exerciseContainer.innerHTML = `
        <div class="${styles["exercise-order"]}">${quickStart.order}</div>        
        <div class="${styles["exercise-info"]}">
          <h3 class="${styles["exercise-name"]}">${ex.name ?? "Unknown Exercise"}</h3>
          <p class="${styles["exercise-muscles"]}">${formatList(ex.muscleGroup)}</p>
          <p class="${styles["exercise-equipments"]}">${formatList(ex.equipment)}</p>
          <div class="${styles["exercise-meta"]}">
            <span class="${styles["exercise-meta-pill"]}">${metaLine || "—"}</span>
            <span class="${styles["exercise-level-badge"]} ${styles[ex.level?.toLowerCase() ?? ""]}" >
              ${ex.level ?? ""}
            </span>
          </div>
        </div>
        <div class="${styles["exercise-actions"]}">
          <button class="${styles["action-btn"]} ${styles["edit-btn"]}" title="Edit">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button class="${styles["action-btn"]} ${styles["delete-btn"]}" title="Remove">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
  `;
      exercisesContainer.appendChild(exerciseContainer);
    })
    .join("");
  return exercisesContainer;
}

/* Helper functions */

// Format list to string with comma and space and capitalize first letter of each item
function formatList(items: string[]): string {
  return items
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(", ");
}

/* Event handlers */

// All event handler
function attachEventHandlers(container: HTMLDivElement, state: PageState) {
  changeWeeklyPlan(container, state);
  editWeeklyPlan(container, state);
  addExerciseHandler(container, state);
}

// Change weekly plan when clicking on day tab
function changeWeeklyPlan(container: HTMLDivElement, state: PageState) {
  const allDayTabs = container.querySelectorAll(`.${styles["day-tab"]}`);

  const handleDayTabClick = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const day = target.getAttribute("data-day");
    const id = target.getAttribute("data-id");
    if (!day || !id) return;
    navigate(`/api/quick-plans/${state.planId}/weekly-plans/${id}`);
  };

  allDayTabs.forEach((tab) => {
    tab.addEventListener("click", handleDayTabClick);
  });
}

// Edit weekly plan
function editWeeklyPlan(container: HTMLDivElement, state: PageState) {
  const editBtn = container.querySelector(
    `.${styles["edit-weekly-plan-exercise-btn"]}`,
  ) as HTMLButtonElement;
  editBtn.addEventListener("click", () => {
    navigate(
      `/api/quick-plans/${state.planId}/weekly-plans/${state.id}/edit?day=${state.weeklyPlan?.dayOfWeek}`,
    );
  });
}

// Add exercise button click handler
function addExerciseHandler(container: HTMLDivElement, state: PageState) {
  const addExerciseBtn = container.querySelector(
    `.${styles["add-exercise-btn"]}`,
  ) as HTMLButtonElement;
  addExerciseBtn.addEventListener("click", () => {
    navigate(
      `/api/quick-plans/${state.planId}/weekly-plans/${state.id}/exercises/new?day=${state.weeklyPlan?.dayOfWeek}&name=${state.weeklyPlan?.name}`,
    );
  });
}

/*--------- Backed Api ------ */

// Fetch all weekly plans for a quick plan
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
