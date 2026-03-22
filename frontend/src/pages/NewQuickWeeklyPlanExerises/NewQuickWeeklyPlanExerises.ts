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

export default async function NewQuickWeeklyPlanExercises(
  params?: Record<string, string>,
) {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

  const planId = params?.planId as string;
  const weeklyId = params?.id as string;

  const [weeklyPlan, weeklyPlanExercises] = await Promise.all([
    fetchWeeklyPlan(planId, weeklyId),
    fetchWeeklyPlanExercises(planId, weeklyId),
  ]);

  const searchParams = new URLSearchParams();
  weeklyPlan?.muscleGroup.forEach((mg) =>
    searchParams.append("muscleGroup", mg),
  );
  const exercises = await fetchExercisesByMuscleGroup(searchParams.toString());

  const savedExercises = weeklyPlanExercises.map(
    (exercise) => exercise.exerciseId,
  );
  const getSavedExercise = (exerciseId: string) =>
    weeklyPlanExercises.find(
      (exercise: WeeklyPlanExercise) => exercise.exerciseId === exerciseId,
    );

  mainApp!.innerHTML = `
    <div class="${styles["exercises-container"]}">     
        ${renderExercises(exercises, savedExercises, getSavedExercise)}  
    </div>
  `;

  handelExerciseDialog();
  handelViewExercise();
  addExerciseToWeeklyPlan(
    planId,
    weeklyId,
    exercises,
    savedExercises,
    getSavedExercise,
  );
  updateExerciseToWeeklyPlan(planId, weeklyId);
}
function renderExercises(
  exercises: Exercise[] | null,
  savedExercises: string[],
  getSavedExercise: (exerciseId: string) => WeeklyPlanExercise | undefined,
): string {
  const container = document.createElement("div");

  container.innerHTML = `
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
                      equipment.charAt(0).toUpperCase() + equipment.slice(1),
                  )
                  .join(", ")}
              </p>
            </div>                
            ${
              savedExercises.includes(exercise.id)
                ? renderUpdateExerciseDialog(
                    exercise,
                    getSavedExercise(exercise.id),
                  ).outerHTML
                : renderExerciseDialog(exercise).outerHTML
            }
          </div> 
        `,
      )
      .join("")}
    </div>
  `;

  return container.innerHTML; // Fix: return innerHTML string
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
      <form class="${formStyles["auth-form"]} ${styles["save-form"]}" method="POST" data-exercise-id="${exercise.id}">
        ${Input({ label: "Sets", id: `sets-${exercise.id}`, type: "number", placeholder: "eg 1", name: "sets", required: true, min: 1, step: 1, errorMessage: "Sets must be a positive integer" })}
        <div class="${styles["exercise-type"]}">
          <h3>Select exercise reps or duration or both</h3>
          <div class="${styles["exercise-type-input"]}">
            ${Input({
              label: "Reps",
              id: `reps-${exercise.id}`,
              type: "number",
              placeholder: "e.g 1",
              name: "reps",
              required: false,
              min: 1,
              step: 1,
              errorMessage: "Reps must be a positive integer",
            })}
            ${Input({
              label: "Duration",
              id: `duration-${exercise.id}`,
              type: "number",
              placeholder: "e.g 1",
              name: "duration",
              required: false,
              min: 1,
              step: 1,
              errorMessage: "Duration must be a positive integer",
            })}
          </div>
        </div>
        <div class="${styles["dialog-action-button-container"]}">
          ${Button({
            label: "Save exercise",
            type: "submit",
            btnClass: styles["save-exercise-btn"],
            data: `data-exercise-id="${exercise.id}"`,
          })}
        </div>
      </form>                    
    </div>
  `;

  return dialogContainer;
}

function renderUpdateExerciseDialog(
  exercise: Exercise,
  savedExercise: WeeklyPlanExercise | undefined,
): HTMLDivElement {
  const dialogContainer = document.createElement("div");
  dialogContainer.className = `${styles["exercise-dialog-container"]} ${styles["hide-dialog"]}`;

  dialogContainer.innerHTML = `
    <div class="${formStyles["auth-container"]} ${styles["exercise-dialog"]}">
      <h2>🏋️ Update ${exercise.name} volume</h2>
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
      <form class="${formStyles["auth-form"]} ${styles["update-form"]}" method="POST" 
        data-exercise-id="${exercise.id}"
        data-weekly-plan-exercise='${JSON.stringify(savedExercise)}'>
        ${Input({ label: "Sets", id: `sets-${exercise.id}`, value: savedExercise?.sets ?? undefined, type: "number", placeholder: "eg 1", name: "sets", required: true, min: 1, step: 1, errorMessage: "Sets must be a positive integer" })}
        <div class="${styles["exercise-type"]}">
          <h3>Select exercise reps or duration or both</h3>
          <div class="${styles["exercise-type-input"]}">
            ${Input({ label: "Reps", id: `reps-${exercise.id}`, value: savedExercise?.reps ?? undefined, type: "number", placeholder: "e.g 1", name: "reps", required: false, min: 1, step: 1, errorMessage: "Reps must be a positive integer" })}
            ${Input({ label: "Duration", id: `duration-${exercise.id}`, value: savedExercise?.duration ?? undefined, type: "number", placeholder: "e.g 1", name: "duration", required: false, min: 1, step: 1, errorMessage: "Duration must be a positive integer" })}
          </div>
        </div>
        <div class="${styles["dialog-action-button-container"]}">
          ${Button({ label: "Update exercise", type: "submit", btnClass: styles["update-exercise-btn"], data: `data-exercise-id=${exercise.id}` })}
          ${Button({ label: "Remove exercise", type: "button", btnClass: styles["remove-exercise-btn"], data: `data-exercise-id=${exercise.id}` })} <!-- Fix: type should be "button" not "submit" -->
        </div>
      </form>                    
    </div>
  `;

  return dialogContainer;
}

function updateExerciseToWeeklyPlan(planId: string, weeklyId: string) {
  const container = document.querySelector<HTMLDivElement>(
    `.${styles["exercises-container"]}`,
  );
  const forms = container?.querySelectorAll<HTMLFormElement>(
    `.${styles["update-form"]}`,
  );

  forms?.forEach((form) => {
    const setsInput =
      form.querySelector<HTMLInputElement>('input[name="sets"]');
    const repsInput =
      form.querySelector<HTMLInputElement>('input[name="reps"]');
    const durationInput = form.querySelector<HTMLInputElement>(
      'input[name="duration"]',
    );
    const updateBtn = form.querySelector<HTMLButtonElement>(
      `.${styles["update-exercise-btn"]}`,
    );

    validate();

    setsInput?.addEventListener("input", validate);
    repsInput?.addEventListener("input", validate);
    durationInput?.addEventListener("input", validate);

    function validate() {
      const sets = setsInput?.value;
      const reps = repsInput?.value;
      const duration = durationInput?.value;

      if (sets && (reps || duration)) {
        updateBtn!.disabled = false;
        updateBtn!.style.backgroundColor = "var(--success-dark)";
      } else {
        updateBtn!.disabled = true;
        updateBtn!.style.backgroundColor = "var(--success-light)";
      }
    }

    async function handleUpdateExercise(e: Event) {
      e.preventDefault();

      const exerciseId = form.dataset.exerciseId;

      const weeklyPlanExercise: WeeklyPlanExercise | null = form.dataset
        .weeklyPlanExercise
        ? JSON.parse(form.dataset.weeklyPlanExercise)
        : null;

      const sets = setsInput?.value;
      const reps = repsInput?.value;
      const duration = durationInput?.value;
      const order = weeklyPlanExercise?.order ?? 1;

      updateBtn!.innerHTML = `${Spinner({})} Updating...`;
      updateBtn!.disabled = true;
      updateBtn!.style.backgroundColor = "var(--success-light)";

      const data: Record<string, string | number> = {
        exerciseId: exerciseId!,
        sets: parseInt(sets!),
        order,
      };

      if (reps) data.reps = parseInt(reps);
      if (duration) data.duration = parseInt(duration);

      try {
        await updateWeeklyPlanExercise(
          planId,
          weeklyId,
          weeklyPlanExercise?.id ?? "",
          data,
        );
      } catch (error) {
        console.error("Error updating weekly plan exercise:", error);
        Notification({
          message: "An error occurred. Please try again",
          type: "error",
          duration: 5000,
        });
      } finally {
        updateBtn!.innerHTML = "Update exercise";
        validate();
      }
    }

    form.addEventListener("submit", handleUpdateExercise);
  });
}

function handelViewExercise() {
  const viewExerciseBtn = document.querySelectorAll<HTMLButtonElement>(
    `.${styles["view-exercise-btn"]}`,
  );

  viewExerciseBtn.forEach((btn) => {
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
      dialog.classList.replace(styles["hide-dialog"], styles["view-dialog"]);
    });
  });

  closeDialogBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const container = btn.closest(`.${styles["exercise-container"]}`);
      const dialog = container!.querySelector(
        `.${styles["exercise-dialog-container"]}`,
      ) as HTMLDivElement;
      dialog.classList.replace(styles["view-dialog"], styles["hide-dialog"]);
    });
  });
}

function addExerciseToWeeklyPlan(
  planId: string,
  weeklyId: string,
  exercises: Exercise[] | null,
  savedExercises: string[],
  getSavedExercise: (exerciseId: string) => WeeklyPlanExercise | undefined,
) {
  const container = document.querySelector<HTMLDivElement>(
    `.${styles["exercises-container"]}`,
  );
  const forms = container!.querySelectorAll<HTMLFormElement>(
    `.${styles["save-form"]}`,
  );

  forms.forEach((form) => {
    const setsInput =
      form.querySelector<HTMLInputElement>('input[name="sets"]');
    const repsInput =
      form.querySelector<HTMLInputElement>('input[name="reps"]');
    const durationInput = form.querySelector<HTMLInputElement>(
      'input[name="duration"]',
    );
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

      if (sets && (reps || duration)) {
        saveBtn!.disabled = false;
        saveBtn!.style.backgroundColor = "var(--success-dark)";
      } else {
        saveBtn!.disabled = true;
        saveBtn!.style.backgroundColor = "var(--success-light)";
      }
    }

    async function handleAddExercise(e: Event) {
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
        const weeklyExercise = await createWeeklyPlanExercise(
          planId,
          weeklyId,
          data,
        );

        if (weeklyExercise) {
          const index = savedExercises.indexOf(exerciseId!);
          if (index === -1) savedExercises.push(exerciseId!);

          container!.innerHTML = renderExercises(
            exercises,
            savedExercises,
            getSavedExercise,
          );

          //re-attach all handlers after re-render since DOM was replaced
          handelExerciseDialog();
          handelViewExercise();
          addExerciseToWeeklyPlan(
            planId,
            weeklyId,
            exercises,
            savedExercises,
            getSavedExercise,
          );
          updateExerciseToWeeklyPlan(planId, weeklyId);
        }
      } catch (error) {
        console.error("Error creating weekly plan exercise:", error);
        Notification({
          message: "An error occurred. Please try again",
          type: "error",
          duration: 5000,
        });
      } finally {
        saveBtn!.innerHTML = "Save exercise";
        validate();
      }
    }

    form.addEventListener("submit", handleAddExercise);
  });
}

async function createWeeklyPlanExercise(
  planId: string,
  weeklyId: string,
  data: Record<string, string | number>,
): Promise<WeeklyPlan | null> {
  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}/exercises/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    },
  );

  const resData = await response.json(); // Fix: avoid shadowing `data` param
  if (response.ok) {
    Notification({
      message: resData.message || "Weekly plan exercise created successfully.",
      type: "success",
      duration: 5000,
    });
    return resData.exercise;
  } else {
    Notification({
      message: resData.error || "Failed to create weekly plan exercise.",
      type: "error",
      duration: 5000,
    });
    return null;
  }
}

async function updateWeeklyPlanExercise(
  planId: string,
  weeklyId: string,
  id: string,
  data: Record<string, string | number>,
): Promise<WeeklyPlan | null> {
  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}/exercises/${id}/update`, // Fix: was "/new"
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    },
  );

  const resData = await response.json();
  if (response.ok) {
    Notification({
      message: resData.message || "Weekly plan exercise updated successfully.",
      type: "success",
      duration: 5000,
    });
    return resData.exercise;
  } else {
    Notification({
      message: resData.error || "Failed to update weekly plan exercise.",
      type: "error",
      duration: 5000,
    });
  }
  return null;
}

async function fetchWeeklyPlan(
  planId: string,
  weeklyId: string,
): Promise<WeeklyPlan | null> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${weeklyId}`,
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
): Promise<WeeklyPlanExercise[]> {
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
