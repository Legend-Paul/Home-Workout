import styles from "./NewQuickWeeklyPlanExerises.module.css";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import type {
  WeeklyPlan,
  Exercise,
  WeeklyPlanExercise,
} from "../../utils/types";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import formStyles from "../../assets/FormStyles.module.css";
import { navigate } from "../../router";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;
const token = localStorage.getItem("Authorization") || "";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface PageState {
  planId: string;
  weeklyId: string;
  exercises: Exercise[];
  weeklyPlanExercises: WeeklyPlanExercise[];
}

function getSavedIds(state: PageState): string[] {
  return state.weeklyPlanExercises.map((e) => e.exerciseId);
}

function getSavedExercise(
  state: PageState,
  exerciseId: string,
): WeeklyPlanExercise | undefined {
  return state.weeklyPlanExercises.find((e) => e.exerciseId === exerciseId);
}

export default async function NewQuickWeeklyPlanExercises(
  params?: Record<string, string>,
) {
  const mainApp = document.getElementById("main-app")!;
  mainApp.innerHTML = Spinner({ type: "large", message: "Loading..." });

  const planId = params?.planId ?? "";
  const weeklyId = params?.id ?? "";

  const [weeklyPlan, weeklyPlanExercises] = await Promise.all([
    fetchWeeklyPlan(planId, weeklyId),
    fetchWeeklyPlanExercises(planId, weeklyId),
  ]);

  const searchParams = new URLSearchParams();
  weeklyPlan?.muscleGroup.forEach((mg) =>
    searchParams.append("muscleGroup", mg),
  );
  const exercises =
    (await fetchExercisesByMuscleGroup(searchParams.toString())) ?? [];

  const state: PageState = {
    planId,
    weeklyId,
    exercises,
    weeklyPlanExercises,
  };

  mainApp.innerHTML = `<div class="${styles["exercises-container"]}"></div>`;
  const container = mainApp.querySelector<HTMLDivElement>(
    `.${styles["exercises-container"]}`,
  )!;

  renderPage(container, state);
}

function renderPage(container: HTMLDivElement, state: PageState) {
  const savedIds = getSavedIds(state);
  container.innerHTML = renderExercises(state.exercises, savedIds, state);
  attachAllHandlers(container, state);
}

function renderExercises(
  exercises: Exercise[],
  savedIds: string[],
  state: PageState,
): string {
  if (!exercises.length) {
    return `<p class="${styles["empty"]}">No exercises found for this plan.</p>`;
  }

  return `
  <div>
    <h2 class="${styles["heading"]}">Add ${getDay()} Exercise</h2>
    <div class="${styles["exercises"]}">
      ${exercises
        .map((exercise) => {
          const isSaved = savedIds.includes(exercise.id);
          const savedExercise = getSavedExercise(state, exercise.id);
          return `
          <div class="${styles["exercise-container"]} ${isSaved ? styles["saved-exercise"] : ""}">
            <div class="${styles["exercise"]}">
              <h3>${exercise.name}</h3>
              <p>${formatList(exercise.muscleGroup)}</p>
              <p>${formatList(exercise.equipment)}</p>
            </div>
            ${
              isSaved
                ? renderUpdateDialog(exercise, savedExercise).outerHTML
                : renderAddDialog(exercise).outerHTML
            }
          </div>`;
        })
        .join("")}
        
    </div>
    ${nextDayButton()}
  </div>  
    
    `;
}

function renderAddDialog(exercise: Exercise): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = `${styles["exercise-dialog-container"]} ${styles["hide-dialog"]}`;
  wrap.innerHTML = `
    <div class="${formStyles["auth-container"]} ${styles["exercise-dialog"]}">
      <h2>🏋️ ${exercise.name} volume</h2>
      <div class="${styles["heading-buttons"]}">
        ${viewExerciseButton(exercise.id)}
      </div>
      ${closeButton()}
      <form
        class="${formStyles["auth-form"]} ${styles["save-form"]}"
        method="POST"
        data-exercise-id="${exercise.id}">
        ${setsInput(exercise.id)}
        ${repsAndDurationInputs(exercise.id)}
        <div class="${styles["dialog-action-button-container"]}">
          ${Button({
            label: "Save exercise",
            type: "submit",
            btnClass: styles["save-exercise-btn"],
            data: `data-exercise-id="${exercise.id}"`,
          })}
        </div>
      </form>
    </div>`;
  return wrap;
}

function renderUpdateDialog(
  exercise: Exercise,
  saved: WeeklyPlanExercise | undefined,
): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = `${styles["exercise-dialog-container"]} ${styles["hide-dialog"]}`;
  wrap.innerHTML = `
    <div class="${formStyles["auth-container"]} ${styles["exercise-dialog"]}">
      <h2>🏋️ Update ${exercise.name} volume</h2>
      <div class="${styles["heading-buttons"]}">
        ${viewExerciseButton(exercise.id)}
      </div>
      ${closeButton()}
      <form
        class="${formStyles["auth-form"]} ${styles["update-form"]}"
        method="POST"
        data-exercise-id="${exercise.id}"
        data-weekly-plan-exercise='${JSON.stringify(saved ?? null)}'>
        ${setsInput(exercise.id, saved?.sets)}
        ${repsAndDurationInputs(exercise.id, saved?.reps, saved?.duration)}
        <div class="${styles["dialog-action-button-container"]}">
          ${Button({
            label: "Update exercise",
            type: "submit",
            btnClass: styles["update-exercise-btn"],
            data: `data-exercise-id="${exercise.id}"`,
          })}
          ${Button({
            label: "Remove exercise",
            type: "button",
            btnClass: styles["remove-exercise-btn"],
            data: `data-weekly-plan-exercise='${JSON.stringify(saved ?? null)}'`,
          })}
        </div>
      </form>
    </div>`;
  return wrap;
}

function viewExerciseButton(exerciseId: string): string {
  return Button({
    label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 9l-6 6m0-6h6v6"/>
    </svg><span>View exercise</span>`,
    type: "button",
    btnClass: styles["view-exercise-btn"],
    data: `data-exercise-id="${exerciseId}"`,
  });
}

function closeButton(): string {
  return `
    <div class="${styles["close-dialog-btn"]}">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </div>`;
}

function nextDayButton() {
  const day = getDay(1);
  return `
  <dv class="${styles["next-day-btns"]}">
    ${
      day
        ? Button({
            label: `${getDay(1)} weekly plan`,
            btnClass: styles["next-day-btn"],
          })
        : Button({
            label: `Finish weekly plan`,
            btnClass: styles["finish-weekly-plan-btn"],
          })
    }
    </div>
  `;
}

function setsInput(exerciseId: string, value?: number | null): string {
  return Input({
    label: "Sets",
    id: `sets-${exerciseId}`,
    type: "number",
    placeholder: "e.g 1",
    name: "sets",
    required: true,
    min: 1,
    step: 1,
    value: value ?? undefined,
    errorMessage: "Sets must be a positive integer",
  });
}

function repsAndDurationInputs(
  exerciseId: string,
  reps?: number | null,
  duration?: number | null,
): string {
  return `
    <div class="${styles["exercise-type"]}">
      <h3>Select exercise reps or duration or both</h3>
      <div class="${styles["exercise-type-input"]}">
        ${Input({
          label: "Reps",
          id: `reps-${exerciseId}`,
          type: "number",
          placeholder: "e.g 1",
          name: "reps",
          required: false,
          min: 1,
          step: 1,
          value: reps ?? undefined,
          errorMessage: "Reps must be a positive integer",
        })}
        ${Input({
          label: "Duration",
          id: `duration-${exerciseId}`,
          type: "number",
          placeholder: "e.g 1",
          name: "duration",
          required: false,
          min: 1,
          step: 1,
          value: duration ?? undefined,
          errorMessage: "Duration must be a positive integer",
        })}
      </div>
    </div>`;
}

function attachAllHandlers(container: HTMLDivElement, state: PageState) {
  attachDialogHandlers(container);
  attachViewHandlers(container);
  attachAddHandlers(container, state);
  attachUpdateHandlers(container, state);
  attachRemoveHandlers(container, state);
}

function attachDialogHandlers(container: HTMLDivElement) {
  container
    .querySelectorAll<HTMLDivElement>(`.${styles["exercise"]}`)
    .forEach((el) => {
      el.addEventListener("click", () => toggleDialog(el, "open"));
    });

  container
    .querySelectorAll<HTMLDivElement>(`.${styles["close-dialog-btn"]}`)
    .forEach((btn) => {
      btn.addEventListener("click", () => toggleDialog(btn, "close"));
    });
}

function toggleDialog(el: Element, action: "open" | "close") {
  const exerciseContainer = el.closest(`.${styles["exercise-container"]}`);
  const dialog = exerciseContainer?.querySelector<HTMLDivElement>(
    `.${styles["exercise-dialog-container"]}`,
  );
  if (!dialog) return;

  if (action === "open") {
    dialog.classList.replace(styles["hide-dialog"], styles["view-dialog"]);
  } else {
    dialog.classList.replace(styles["view-dialog"], styles["hide-dialog"]);
  }
}

function attachViewHandlers(container: HTMLDivElement) {
  container
    .querySelectorAll<HTMLButtonElement>(`.${styles["view-exercise-btn"]}`)
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        navigate(`/api/exercises/${btn.dataset.exerciseId}`);
      });
    });
}

function attachAddHandlers(container: HTMLDivElement, state: PageState) {
  container
    .querySelectorAll<HTMLFormElement>(`.${styles["save-form"]}`)
    .forEach((form) => {
      const { setsEl, repsEl, durationEl } = getFormInputs(form);
      const saveBtn = form.querySelector<HTMLButtonElement>(
        `.${styles["save-exercise-btn"]}`,
      )!;

      const validate = makeValidator(setsEl, repsEl, durationEl, saveBtn);
      setsEl?.addEventListener("input", validate);
      repsEl?.addEventListener("input", validate);
      durationEl?.addEventListener("input", validate);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const exerciseId = form.dataset.exerciseId!;
        const payload = buildPayload(exerciseId, setsEl, repsEl, durationEl);

        setButtonLoading(
          saveBtn,
          Spinner({}),
          "Saving...",
          "var(--success-light)",
        );

        try {
          const created = await createWeeklyPlanExercise(
            state.planId,
            state.weeklyId,
            payload,
          );

          if (created) {
            if (
              !state.weeklyPlanExercises.some(
                (e) => e.exerciseId === exerciseId,
              )
            ) {
              state.weeklyPlanExercises.push(created);
            }
            renderPage(container, state);
          }
        } catch {
          showError();
        } finally {
          setButtonText(saveBtn, "Save exercise");
          validate();
        }
      });
    });
}

function attachUpdateHandlers(container: HTMLDivElement, state: PageState) {
  container
    .querySelectorAll<HTMLFormElement>(`.${styles["update-form"]}`)
    .forEach((form) => {
      const { setsEl, repsEl, durationEl } = getFormInputs(form);
      const updateBtn = form.querySelector<HTMLButtonElement>(
        `.${styles["update-exercise-btn"]}`,
      )!;

      const validate = makeValidator(setsEl, repsEl, durationEl, updateBtn);
      validate();
      setsEl?.addEventListener("input", validate);
      repsEl?.addEventListener("input", validate);
      durationEl?.addEventListener("input", validate);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const exerciseId = form.dataset.exerciseId!;
        const saved: WeeklyPlanExercise | null = form.dataset.weeklyPlanExercise
          ? JSON.parse(form.dataset.weeklyPlanExercise)
          : null;

        const payload = buildPayload(
          exerciseId,
          setsEl,
          repsEl,
          durationEl,
          saved?.order ?? 1,
        );

        setButtonLoading(
          updateBtn,
          Spinner({}),
          "Updating...",
          "var(--success-light)",
        );

        try {
          const updated = await updateWeeklyPlanExercise(
            state.planId,
            state.weeklyId,
            saved?.id ?? "",
            payload,
          );

          if (updated) {
            const idx = state.weeklyPlanExercises.findIndex(
              (e) => e.id === updated.id,
            );
            if (idx !== -1) state.weeklyPlanExercises[idx] = updated;
            renderPage(container, state);
          }
        } catch {
          showError();
        } finally {
          setButtonText(updateBtn, "Update exercise");
          validate();
        }
      });
    });
}

function attachRemoveHandlers(container: HTMLDivElement, state: PageState) {
  container
    .querySelectorAll<HTMLButtonElement>(`.${styles["remove-exercise-btn"]}`)
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const saved: WeeklyPlanExercise | null = btn.dataset.weeklyPlanExercise
          ? JSON.parse(btn.dataset.weeklyPlanExercise)
          : null;

        setButtonLoading(btn, Spinner({}), "Removing...", "var(--error-dark)");

        try {
          const removed = await removeWeeklyPlanExercise(
            state.planId,
            state.weeklyId,
            saved?.id ?? "",
          );

          if (removed) {
            state.weeklyPlanExercises = state.weeklyPlanExercises.filter(
              (e) => e.id !== saved?.id,
            );
            renderPage(container, state);
          }
        } catch {
          showError();
        }
      });
    });
}

function getFormInputs(form: HTMLFormElement) {
  return {
    setsEl: form.querySelector<HTMLInputElement>('input[name="sets"]'),
    repsEl: form.querySelector<HTMLInputElement>('input[name="reps"]'),
    durationEl: form.querySelector<HTMLInputElement>('input[name="duration"]'),
  };
}

function makeValidator(
  setsEl: HTMLInputElement | null,
  repsEl: HTMLInputElement | null,
  durationEl: HTMLInputElement | null,
  btn: HTMLButtonElement,
) {
  return function validate() {
    const valid = setsEl?.value && (repsEl?.value || durationEl?.value);
    btn.disabled = !valid;
    btn.style.backgroundColor = valid
      ? "var(--success-dark)"
      : "var(--success-light)";
  };
}

function buildPayload(
  exerciseId: string,
  setsEl: HTMLInputElement | null,
  repsEl: HTMLInputElement | null,
  durationEl: HTMLInputElement | null,
  order = 1,
): Record<string, string | number> {
  const payload: Record<string, string | number> = {
    exerciseId,
    sets: parseInt(setsEl?.value ?? "1"),
    order,
  };
  if (repsEl?.value) payload.reps = parseInt(repsEl.value);
  if (durationEl?.value) payload.duration = parseInt(durationEl.value);
  return payload;
}

function setButtonLoading(
  btn: HTMLButtonElement,
  spinner: string,
  label: string,
  bg: string,
) {
  btn.innerHTML = `${spinner} ${label}`;
  btn.disabled = true;
  btn.style.backgroundColor = bg;
}

function setButtonText(btn: HTMLButtonElement, label: string) {
  btn.innerHTML = label;
}

function showError() {
  Notification({
    message: "An error occurred. Please try again",
    type: "error",
    duration: 5000,
  });
}

function formatList(items: string[]): string {
  return items
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(", ");
}

function getDay(day: number = 0): string {
  const nextDay: string | null = new URLSearchParams(
    window.location.search,
  ).get("nextDay");
  const num = Number(nextDay);
  if (!isNaN(num) && isFinite(num)) {
    return weekDays[num - (1 - day)];
  }
  return weekDays[0];
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

async function createWeeklyPlanExercise(
  planId: string,
  weeklyId: string,
  data: Record<string, string | number>,
): Promise<WeeklyPlanExercise | null> {
  const res = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}/exercises/new`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );
  const json = await res.json();
  Notification({
    message:
      json.message ?? (res.ok ? "Exercise saved." : "Failed to save exercise."),
    type: res.ok ? "success" : "error",
    duration: 5000,
  });
  return res.ok ? json.exercise : null;
}

async function updateWeeklyPlanExercise(
  planId: string,
  weeklyId: string,
  id: string,
  data: Record<string, string | number>,
): Promise<WeeklyPlanExercise | null> {
  const res = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}/exercises/${id}/update`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );
  const json = await res.json();
  Notification({
    message:
      json.message ??
      (res.ok ? "Exercise updated." : "Failed to update exercise."),
    type: res.ok ? "success" : "error",
    duration: 5000,
  });
  return res.ok ? json.exercise : null;
}

async function removeWeeklyPlanExercise(
  planId: string,
  weeklyId: string,
  id: string,
): Promise<WeeklyPlanExercise | null> {
  const res = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}/exercises/${id}/delete`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  const json = await res.json();
  Notification({
    message:
      json.message ??
      (res.ok ? "Exercise removed." : "Failed to remove exercise."),
    type: res.ok ? "success" : "error",
    duration: 5000,
  });
  return res.ok ? json.exercise : null;
}

async function fetchWeeklyPlan(
  planId: string,
  weeklyId: string,
): Promise<WeeklyPlan | null> {
  try {
    const res = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    const json = await res.json();
    if (!res.ok) {
      Notification({
        message: json.error ?? "Failed to fetch weekly plan.",
        type: "error",
        duration: 5000,
      });
    }
    return json.weeklyPlan ?? null;
  } catch {
    return null;
  }
}

async function fetchExercisesByMuscleGroup(
  params: string,
): Promise<Exercise[]> {
  try {
    const res = await fetch(`${backendUrl}/api/exercises?${params}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) {
      Notification({
        message: json.error ?? "Failed to fetch exercises.",
        type: "error",
        duration: 5000,
      });
    }
    return json.exercises ?? [];
  } catch {
    return [];
  }
}

async function fetchWeeklyPlanExercises(
  planId: string,
  weeklyId: string,
): Promise<WeeklyPlanExercise[]> {
  try {
    const res = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}/exercises`,
      { method: "GET", headers: authHeaders() },
    );
    const json = await res.json();
    if (!res.ok) {
      Notification({
        message: json.error ?? "Failed to fetch exercises.",
        type: "error",
        duration: 5000,
      });
    }
    return json.exercises ?? [];
  } catch {
    return [];
  }
}
