import styles from "./NewQuickWeeklyPlanExerises.module.css";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import type {
  WeeklyPlan,
  Exercise,
  WeeklyPlanExecise,
} from "../../utils/types";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import formStyles from "../../assets/FormStyles.module.css";
import { navigate } from "../../router";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";
export default async function NewQuickWeeklyPlanExercises(
  params?: Record<string, string>,
) {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

  const planId = params?.planId as string;
  const id = params?.id as string;
  const [weeklyPlan, weeklyPlanExercises] = await Promise.all([
    fetchWeeklyPlan(planId, id),
    fetchWeeklyPlanExercises(planId, id),
  ]);

  const searchParams = new URLSearchParams();
  weeklyPlan?.muscleGroup.forEach((mg) =>
    searchParams.append("muscleGroup", mg),
  );
  const exercises = await fetchExercisesByMuscleGroup(searchParams.toString());

  const savedExercises = weeklyPlanExercises.map(
    (exercise) => exercise.exerciseId,
  );
  console.log(savedExercises);
  mainApp!.innerHTML = `
    <div class="${styles["exercises-container"]}">
      <div>
      <div class="${styles["exercises"]}">
        ${exercises
          ?.map(
            (exercise) => `
              <div class="${styles["exercise-container"]} 
              ${savedExercises.includes(exercise.id) ? styles["saved-exercise"] : ""}">
                <div class="${styles["exercise"]}">
                  <h3>${exercise.name}</h3>
                  <p>
                    ${exercise.muscleGroup
                      .map(
                        (muscleGroup: string) =>
                          muscleGroup.charAt(0).toUpperCase() +
                          muscleGroup.slice(1),
                      )
                      .join(", ")}
                  </p>
                  <p>
                    ${exercise.equipment
                      .map(
                        (equipment) =>
                          equipment.charAt(0).toUpperCase() +
                          equipment.slice(1),
                      )
                      .join(", ")}
                  </p>
                </div>                
                ${renderExerciseDialog(exercise).outerHTML}
                </div> 
              </div>
            `,
          )
          .join("")}
      </div>

    </div>
  `;
  handelExerciseDialog();
  handelViewExercise();
  addExerciseToWeeklyPlan(planId, id);
}

function renderExerciseDialog(exercise: Exercise): HTMLDivElement {
  const dialogContainer = document.createElement("div");
  dialogContainer.className = `${styles["exercise-dialog-container"]} ${styles["hide-dialog"]}`;

  dialogContainer.innerHTML = `
    <div class="${formStyles["auth-container"]} ${styles["exercise-dialog"]}">
      <h2>🏋️ ${exercise.name} volume</h2>
      <div class="${styles["heading-buttons"]}">                      
        ${Button({
          label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6h6v6" />
                  </svg><span>View exercise</span>`,
          type: "button",
          btnClass: styles["view-exercise-btn"],
          data: `data-exercise-id=${exercise.id}`,
        })}
      </div>
      <div class="${styles["close-dialog-btn"]}">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <form id="${formStyles["auth-form"]}" method="POST" data= "data-exercise-id=${exercise.id}">
        ${Input({ label: "Sets", id: "sets", type: "number", placeholder: "eg 1", name: "sets", required: true, min: 1, step: 1, errorMessage: "Sets must be an integer" })}
        <div class="${styles["exercise-type"]}">
          <h3>Select exercise reps or duration or both</h3>
          <div class="${styles["exercise-type-input"]}">
            ${Input({
              label: "Reps",
              id: "reps",
              type: "number",
              placeholder: "e.g 1",
              name: "reps",
              required: false,
              min: 1,
              step: 1,
              errorMessage: "Reps must be an integer",
            })}
            ${Input({
              label: "Duration",
              id: "duration",
              type: "number",
              placeholder: "e.g 1",
              name: "duration",
              required: false,
              min: 1,
              step: 1,
              errorMessage: "Duration must be an integer",
            })}
          </div>
        </div>
        <div class="${styles["dialog-action-button-container"]}">
          ${Button({
            label: "Save exercise",
            type: "submit",
            btnClass: styles["save-exercise-btn"],
            data: `data-exercise-id=${exercise.id}`,
          })}
        </div>
      </form>                    
    </div>
  `;

  return dialogContainer;
}

function handelViewExercise() {
  const viewExerciseBtn = document.querySelectorAll<HTMLButtonElement>(
    `.${styles["view-exercise-btn"]}`,
  );

  viewExerciseBtn.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", () => {
      const exerciseId = btn.dataset.exerciseId;
      navigate(`/api/exercises/${exerciseId}`);
    });
  });
}

function handelExerciseDialog() {
  const exercisesDiv = document.querySelectorAll<HTMLDivElement>(
    `.${styles["exercise"]}`,
  );
  const closeDialogBtn = document.querySelectorAll<HTMLDivElement>(
    `.${styles["close-dialog-btn"]}`,
  );

  exercisesDiv.forEach((exercise) => {
    exercise.addEventListener("click", () => {
      const container = exercise.closest(`.${styles["exercise-container"]}`);
      const dialog = container!.querySelector(
        `.${styles["exercise-dialog-container"]}`,
      ) as HTMLDivElement;
      dialog.classList.replace(
        `${styles["hide-dialog"]}`,
        `${styles["view-dialog"]}`,
      );
    });
  });

  closeDialogBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const container = btn.closest(`.${styles["exercise-container"]}`);
      const dialog = container!.querySelector(
        `.${styles["exercise-dialog-container"]}`,
      ) as HTMLDivElement;
      dialog.classList.replace(
        `${styles["view-dialog"]}`,
        `${styles["hide-dialog"]}`,
      );
    });
  });
}

function addExerciseToWeeklyPlan(planId: string, id: string) {
  const exerciseContainer = document.querySelector(
    `.${styles["exercises-container"]}`,
  );
  const forms = exerciseContainer!.querySelectorAll<HTMLFormElement>(
    `#${formStyles["auth-form"]}`,
  );
  // Form validation
  forms.forEach((form) => {
    const setsInput = form.querySelector<HTMLInputElement>("#sets");
    const repsInput = form.querySelector<HTMLInputElement>("#reps");
    const durationInput = form.querySelector<HTMLInputElement>("#duration");
    const saveBtn = form.querySelector<HTMLButtonElement>(
      `.${styles["save-exercise-btn"]}`,
    );

    setsInput?.addEventListener("input", validate);
    repsInput?.addEventListener("input", validate);
    durationInput?.addEventListener("input", validate);

    function validate() {
      const sets = setsInput?.value;
      const reps = repsInput?.value;
      const duration = durationInput?.value;

      form
        .querySelectorAll("input")
        .forEach((input) => input.setCustomValidity(""));

      // Valid: sets and at least reps or duration required
      if (sets && (reps || duration)) {
        saveBtn!.disabled = false;
        saveBtn!.style.backgroundColor = "var(--success-dark)";
      } else {
        saveBtn!.disabled = true;
        saveBtn!.style.backgroundColor = "var(--success-light)";
      }
    }

    async function handleAddExerciseToWeeklyPlan(e: Event) {
      e.preventDefault();
      const exerciseId = saveBtn?.dataset.exerciseId;
      const sets = setsInput?.value;
      const reps = repsInput?.value;
      const duration = durationInput?.value;
      const order = 1;

      saveBtn!.innerHTML = `${Spinner({})} Saving...`;
      saveBtn!.disabled = true;
      saveBtn!.style.backgroundColor = "var(--success-light)";

      const data: Record<string, string | number> = {
        exerciseId: exerciseId!,
        sets: parseInt(sets!),
        order,
      };

      if (reps) data.reps = parseInt(reps);
      if (duration) data.duration = parseInt(duration);

      try {
        await createWeeklyPlanExercise(planId, id, data);
      } catch (error) {
        console.error("Error Creating weekly plan exercise:", error);
        Notification({
          message: "An error occurred. Please try again",
          type: "error",
          duration: 5000,
        });
      } finally {
        saveBtn!.innerHTML = "Save exercise";
        // Re-run validate to restore correct button state
        validate();
      }
    }
    form.addEventListener("submit", handleAddExerciseToWeeklyPlan);
  });
}

async function createWeeklyPlanExercise(
  planId: string,
  id: string,
  data: Record<string, string | number>,
) {
  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}/exercises/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    },
  );

  if (response.ok) {
    const data = await response.json();
    Notification({
      message: data.message || "Weekly pan exercise created successfullly.",
      type: "success",
      duration: 5000,
    });
  } else {
    const data = await response.json();
    Notification({
      message: data.error || "Failed to fetch Weekly plan.",
      type: "error",
      duration: 5000,
    });
  }
}

async function fetchWeeklyPlan(
  planId: string,
  id: string,
): Promise<WeeklyPlan | null> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    const data = await response.json();

    if (!response.ok) {
      Notification({
        message: data.error || "Failed to fetch Weekly plan",
        type: "error",
        duration: 5000,
      });
    }
    return data.weeklyPlan;
  } catch (error) {
    return null;
  }
}

async function fetchExercisesByMuscleGroup(
  params: string,
): Promise<Exercise[] | null> {
  try {
    const response = await fetch(`${backendUrl}/api/exercises?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      Notification({
        message: data.error || "Failed to fetch exercises",
        type: "error",
        duration: 5000,
      });
    }
    return data.exercises;
  } catch (error) {
    return [];
  }
}

async function fetchWeeklyPlanExercises(
  planId: string,
  id: string,
): Promise<WeeklyPlanExecise[]> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}/exercises`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    const data = await response.json();

    if (!response.ok) {
      Notification({
        message: data.error || "Failed to fetch Weekly plan exercises",
        type: "error",
        duration: 5000,
      });
    }
    return data.exercises;
  } catch (error) {
    return [];
  }
}
