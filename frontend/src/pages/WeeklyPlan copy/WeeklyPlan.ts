import styles from "./Weeklyplan.module.css";
import { back } from "../../router";
import Button from "../../components/Button/Button";

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

export type WeeklyPlanExercise = {
  id: string;
  quickStartWeeklyPlanId: string;
  exerciseId: string;
  order: number;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  createdAt: string;
  exercises?: Exercise;
  updatedAt: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock data — replace with real API data
const MOCK_PLAN: Record<string, WeeklyPlanExercise[]> = {
  Mon: [
    {
      id: "1",
      quickStartWeeklyPlanId: "plan-1",
      exerciseId: "ex-1",
      order: 1,
      reps: 12,
      sets: 3,
      duration: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: {
        id: "ex-1",
        name: "Push-Up",
        description: "Classic upper body push exercise.",
        imageUrl: "https://via.placeholder.com/80",
        level: "BEGINNER",
        muscleGroup: ["Chest", "Triceps"],
        equipment: ["Bodyweight"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: "2",
      quickStartWeeklyPlanId: "plan-1",
      exerciseId: "ex-2",
      order: 2,
      reps: null,
      sets: 4,
      duration: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: {
        id: "ex-2",
        name: "Plank Hold",
        description: "Core stabilisation hold.",
        imageUrl: "https://via.placeholder.com/80",
        level: "ALL",
        muscleGroup: ["Core", "Shoulders"],
        equipment: ["Bodyweight"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
  Wed: [
    {
      id: "3",
      quickStartWeeklyPlanId: "plan-1",
      exerciseId: "ex-3",
      order: 1,
      reps: 10,
      sets: 4,
      duration: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: {
        id: "ex-3",
        name: "Squat",
        description: "Compound lower body exercise.",
        imageUrl: "https://via.placeholder.com/80",
        level: "BEGINNER",
        muscleGroup: ["Quads", "Glutes", "Hamstrings"],
        equipment: ["Bodyweight"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
  Fri: [
    {
      id: "4",
      quickStartWeeklyPlanId: "plan-1",
      exerciseId: "ex-4",
      order: 1,
      reps: 8,
      sets: 3,
      duration: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: {
        id: "ex-4",
        name: "Pull-Up",
        description: "Upper body pulling movement.",
        imageUrl: "https://via.placeholder.com/80",
        level: "INTERMEDIATE",
        muscleGroup: ["Back", "Biceps"],
        equipment: ["Pull-up bar"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: "5",
      quickStartWeeklyPlanId: "plan-1",
      exerciseId: "ex-5",
      order: 2,
      reps: null,
      sets: 3,
      duration: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: {
        id: "ex-5",
        name: "Battle Ropes",
        description: "High-intensity full-body conditioning.",
        imageUrl: "https://via.placeholder.com/80",
        level: "ADVANCED",
        muscleGroup: ["Shoulders", "Core", "Arms"],
        equipment: ["Battle Ropes"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
};

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "#34d399",
  INTERMEDIATE: "#fbbf24",
  ADVANCED: "#f87171",
  ALL: "#818cf8",
};

function getLevelColor(level: string) {
  return LEVEL_COLORS[level] ?? "#94a3b8";
}

function renderExerciseCards(exercises: WeeklyPlanExercise[]): string {
  if (!exercises || exercises.length === 0) {
    return `
      <div class="${styles["empty-state"]}">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>Rest day — no exercises scheduled</p>
        <button class="${styles["add-rest-day-btn"]}">Add Exercise</button>
      </div>`;
  }

  return exercises
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const ex = item.exercises;
      const levelColor = getLevelColor(ex?.level ?? "ALL");
      const metaLine = [
        item.sets ? `${item.sets} sets` : null,
        item.reps ? `${item.reps} reps` : null,
        item.duration ? `${item.duration}s` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      return `
      <div class="${styles["exercise-card"]}">
        <div class="${styles["exercise-order"]}">${item.order}</div>
        
        <div class="${styles["exercise-info"]}">
          <h3 class="${styles["exercise-name"]}">${ex?.name ?? "Unknown Exercise"}</h3>
          <p class="${styles["exercise-muscles"]}">${ex?.muscleGroup.join(", ") ?? ""}</p>
          <div class="${styles["exercise-meta"]}">
            <span class="${styles["exercise-meta-pill"]}">${metaLine || "—"}</span>
            <span class="${styles["exercise-level-badge"]}" style="color:${levelColor}; border-color:${levelColor}20; background:${levelColor}12">
              ${ex?.level ?? ""}
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
      </div>`;
    })
    .join("");
}

function renderDayTabs(activeDay: string): string {
  return DAYS.map((day) => {
    const hasExercises = !!(MOCK_PLAN[day] && MOCK_PLAN[day].length > 0);
    const isActive = day === activeDay;
    return `
      <button
        class="${styles["day-tab"]} ${isActive ? styles["day-tab--active"] : ""}"
        data-day="${day}"
      >
        ${day}
        ${hasExercises ? `<span class="${styles["day-dot"]}"></span>` : ""}
      </button>`;
  }).join("");
}

export default function WeeklyPlan() {
  const mainApp = document.getElementById("main-app");
  let activeDay = DAYS[0];

  const render = () => {
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
            <h2 class="${styles["page-heading"]}">Weekly Plan</h2>
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
            ${renderDayTabs(activeDay)}
          </div>
        </div>

        <div class="${styles["weekly-plan-content-container"]}">
          <div class="${styles["day-label"]}">
            <span>${activeDay === new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3) ? "Today · " : ""}${activeDay}</span>
            <span class="${styles["exercise-count"]}">${(MOCK_PLAN[activeDay] ?? []).length} exercise${(MOCK_PLAN[activeDay] ?? []).length !== 1 ? "s" : ""}</span>
          </div>
          <div class="${styles["weekly-plan-exercises"]}">
            ${renderExerciseCards(MOCK_PLAN[activeDay] ?? [])}
          </div>
        </div>
      </div>`;

    setupListeners();
  };

  const setupListeners = () => {
    const container = document.querySelector<HTMLDivElement>(
      `.${styles["weekly-plan-container"]}`,
    )!;

    // Back button
    container
      .querySelector(`.${styles["back-btn"]}`)
      ?.addEventListener("click", () => back());

    // Day tabs
    container
      .querySelectorAll<HTMLButtonElement>(`.${styles["day-tab"]}`)
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          activeDay = btn.dataset.day!;
          render();
        });
      });
  };

  render();
}
