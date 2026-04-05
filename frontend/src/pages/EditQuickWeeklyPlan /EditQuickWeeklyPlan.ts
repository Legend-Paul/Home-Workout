import styles from "../NewQuickWeeklyPlan/NewQuickWeeklyPlan.module.css";
import formStyles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import { back } from "../../router";
import Spinner from "../../components/Spinner/Spinner";
import type { WeeklyPlan } from "../../utils/types";

const daysOfWeek: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Create header content-type and authorization
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";

export default async function EditQuickWeeklyPlan(
  params?: Record<string, string>,
) {
  const mainApp = document.getElementById("main-app");

  const dayIndex: string | null = new URLSearchParams(
    window.location.search,
  ).get("day");

  const planId = params?.planId as string;
  const id = params?.id as string;
  console.log("planId", planId);
  console.log("id", id);

  const weeklyPlan = await fetchWeeklyPlan(planId, id);
  const day = dayIndex ? daysOfWeek[Number(dayIndex)] : daysOfWeek[0];

  mainApp!.innerHTML = `
    <div class="${styles["new-weekly-plan-container"]}">
      <div class="${formStyles["auth-form-container"]}">
          <h2>🏋️ Create ${day} plan!</h2>
          ${Button({
            label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg> <span>Back</span>`,
            type: "button",
            btnClass: styles["back-btn"],
          })}
          <div class="${styles["day-status"]}">
              <span  class="${styles["create-day-chip"]} ${styles["active"]}">Create Day Plan</span>
              <span  class="${styles["rest-day-chip"]} ">Rest Day</span>
          </div>
      </div>
        <div class="${styles["content-container"]}">
            <form id="${formStyles["auth-form"]}" 
            data-weekly-plan-id="${id}"           
            class="${styles["form"]} ${styles["show-form"]}" method="POST">
                    ${Input({
                      label: "Name",
                      id: "name",
                      type: "input",
                      placeholder: "e.g Destroyer",
                      name: "name",
                      required: true,
                      minLength: 3,
                      errorMessage: "Name must be at least 3 characters",
                      value: weeklyPlan?.name || "",
                    })}
                    <div class="${styles["weekly-plan-checkbox-container"]} ${styles["weekly-plan-level-container"]}">
                        <h3>Select Musle Group</h3>
                        <div class="${styles["weekly-plan-checkbox"]}">
                            ${muscleGroupCheckboxInput("Chest", weeklyPlan?.muscleGroup.includes("chest"))}
                            ${muscleGroupCheckboxInput("Lats", weeklyPlan?.muscleGroup.includes("lats"))}
                            ${muscleGroupCheckboxInput("Traps", weeklyPlan?.muscleGroup.includes("traps"))}
                            ${muscleGroupCheckboxInput("Back", weeklyPlan?.muscleGroup.includes("back"))}
                            ${muscleGroupCheckboxInput("Shoulder", weeklyPlan?.muscleGroup.includes("shoulder"))}
                            ${muscleGroupCheckboxInput("Biceps", weeklyPlan?.muscleGroup.includes("biceps"))}
                            ${muscleGroupCheckboxInput("Triceps", weeklyPlan?.muscleGroup.includes("triceps"))}
                            ${muscleGroupCheckboxInput("Legs", weeklyPlan?.muscleGroup.includes("legs"))}
                            ${muscleGroupCheckboxInput("Abs", weeklyPlan?.muscleGroup.includes("abs"))}
                              
                        </div>     
                    </div>    
                
                    ${Button({
                      label: `Update ${day} Plan`,
                      type: "submit",
                      btnClass: styles["create-weekly-plan"],
                    })}                
            </form>
            <div class="${styles["rest-day-message"]} ${styles["hide-rest"]}">
                <p>Rest, recharge, and reflect. Sometimes the most productive thing you can do is relax. </p>
                ${Button({
                  label: `Update ${day} Plan`,
                  btnClass: styles["create-rest-day"],
                  data: `data-weekly-plan-id="${id}"`,
                })}

            </div>
        </div>
    </div>
    `;

  changeDayStatusDisplay();
  validateForm();
  updateRestDay(planId, Number(dayIndex));
  updateWeeklyPlanDay(planId, Number(dayIndex));
  backButtonHandler();
}

function muscleGroupCheckboxInput(label: string, checked = false) {
  return Input({
    label,
    id: label.toLowerCase(),
    type: "checkbox",
    placeholder: "",
    name: "muscleGroup",
    minLength: 3,
    errorMessage: "",
    checked,
    value: label.toLowerCase(),
  });
}

// handle back button click
function backButtonHandler() {
  const backBtn = document.querySelector(
    `.${styles["back-btn"]}`,
  ) as HTMLButtonElement;
  backBtn.addEventListener("click", () => {
    back();
  });
}

// Handle change between create day plan and rest day
function changeDayStatusDisplay() {
  const createDayChip = document.querySelector(
    `.${styles["create-day-chip"]}`,
  ) as HTMLSpanElement;
  const restDayChip = document.querySelector(
    `.${styles["rest-day-chip"]}`,
  ) as HTMLSpanElement;
  const restDayMessage = document.querySelector(
    `.${styles["rest-day-message"]}`,
  ) as HTMLDivElement;

  const form = document.querySelector(`.${styles["form"]}`) as HTMLFormElement;

  createDayChip?.addEventListener("click", () => {
    restDayChip?.classList.remove(`${styles["active"]}`);
    createDayChip?.classList.add(`${styles["active"]}`);

    // show form
    form?.classList.replace(`${styles["hide-form"]}`, `${styles["show-form"]}`);
    // hide rest message
    restDayMessage?.classList.replace(
      `${styles["show-rest"]}`,
      `${styles["hide-rest"]}`,
    );
  });

  restDayChip?.addEventListener("click", () => {
    createDayChip?.classList.remove(`${styles["active"]}`);
    restDayChip?.classList.add(`${styles["active"]}`);

    // show form
    form?.classList.replace(`${styles["show-form"]}`, `${styles["hide-form"]}`);
    // hide rest message
    restDayMessage?.classList.replace(
      `${styles["hide-rest"]}`,
      `${styles["show-rest"]}`,
    );
  });
}

// Validate form input and enable/disable submit button
function validateForm() {
  const weeklyPlanContainer = document.querySelector(
    `.${styles["new-weekly-plan-container"]}`,
  ) as HTMLDivElement;
  const nameInput = weeklyPlanContainer!.querySelector(
    "#name",
  ) as HTMLInputElement;
  const updateWeeklyPlanBtn = weeklyPlanContainer!.querySelector(
    `.${styles["create-weekly-plan"]}`,
  ) as HTMLButtonElement;
  weeklyPlanContainer!
    .querySelectorAll<HTMLInputElement>("input[type='checkbox']")
    .forEach((checkbox: HTMLInputElement) =>
      checkbox.addEventListener("change", validate),
    );

  const getCheckedMuscleGroup = (): string[] => {
    const checkedElements =
      weeklyPlanContainer!.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']:checked",
      );
    return Array.from(checkedElements).map((checkbox) => checkbox.value);
  };
  validate();
  nameInput.addEventListener("change", validate);

  function validate() {
    const name = nameInput.value.trim();
    const muscleGroup = getCheckedMuscleGroup();

    if (name.length >= 3 && muscleGroup.length > 0) {
      updateWeeklyPlanBtn.disabled = false;
      updateWeeklyPlanBtn.style.backgroundColor = "var(--primary-dark)";
    } else {
      updateWeeklyPlanBtn.disabled = true;
      updateWeeklyPlanBtn.style.backgroundColor = "var(--primary-light)";
    }
  }
}

// Update weekly plan for the day to rest day
function updateRestDay(planId: string, day: number) {
  const weeklyPlanContainer = document.querySelector(
    `.${styles["new-weekly-plan-container"]}`,
  ) as HTMLDivElement;
  const updateRestDayBtn = weeklyPlanContainer!.querySelector(
    `.${styles["create-rest-day"]}`,
  ) as HTMLButtonElement;
  const id = updateRestDayBtn?.getAttribute("data-weekly-plan-id") as string;

  const updateRestDayHandler = async () => {
    const data = {
      name: "Rest Day",
      dayOfWeek: day,
      muscleGroup: [],
      isRestDay: true,
    };
    updateRestDayBtn.disabled = true;
    updateRestDayBtn.style.backgroundColor = "var(--primary-light) !important";
    updateRestDayBtn.innerHTML = `${Spinner({})}  Updating...`;
    try {
      await updateWeeklyPlanRestDay(planId, id, data);
    } catch (error) {
      console.log("Failed to update rest day:", error);
    } finally {
      updateRestDayBtn.innerHTML = `Update ${daysOfWeek[day]} Plan`;
      updateRestDayBtn.disabled = false;
      updateRestDayBtn.style.backgroundColor = "var(--primary-dark) !important";
    }
  };

  updateRestDayBtn?.addEventListener("click", updateRestDayHandler);
}

// Update weekly plan for the day
function updateWeeklyPlanDay(planId: string, day: number) {
  const weeklyPlanContainer = document.querySelector(
    `.${styles["new-weekly-plan-container"]}`,
  ) as HTMLDivElement;
  const nameInput = weeklyPlanContainer!.querySelector(
    "#name",
  ) as HTMLInputElement;
  const form = weeklyPlanContainer!.querySelector(
    `.${styles["form"]}`,
  ) as HTMLFormElement;
  const updateWeeklyPlanBtn = weeklyPlanContainer!.querySelector(
    `.${styles["create-weekly-plan"]}`,
  ) as HTMLButtonElement;

  const getCheckedMuscleGroup = (): string[] => {
    const checkedElements =
      weeklyPlanContainer!.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']:checked",
      );
    return Array.from(checkedElements).map((checkbox) => checkbox.value);
  };

  const updateWeeklyPlanDayHandler = async (e: Event) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const muscleGroup = getCheckedMuscleGroup();

    const data = {
      name,
      dayOfWeek: day,
      muscleGroup,
    };
    const id = form.getAttribute("data-weekly-plan-id") as string;

    updateWeeklyPlanBtn.disabled = true;
    updateWeeklyPlanBtn.style.backgroundColor =
      "var(--primary-light) !important";
    updateWeeklyPlanBtn.innerHTML = `${Spinner({})}  Updating...`;

    try {
      await updateWeeklyPlan(planId, id, data);
    } catch (error) {
      console.log("Failed to update weekly plan:", error);
    } finally {
      updateWeeklyPlanBtn.innerHTML = `Update ${daysOfWeek[day]} Plan`;
      updateWeeklyPlanBtn.disabled = false;
      updateWeeklyPlanBtn.style.backgroundColor =
        "var(--primary-dark) !important";
    }
  };
  console.log("form", form);
  form.addEventListener("submit", updateWeeklyPlanDayHandler);
}

/* Backend Api Calls */

// update weekly plan for the day
async function updateWeeklyPlan(
  planId: string,
  id: string,
  data: {
    name: string;
    dayOfWeek: number;
    muscleGroup: string[];
  },
) {
  console.log(data);

  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}/update`,
    {
      headers: authHeaders(),
      body: JSON.stringify(data),
      method: "PUT",
    },
  );
  if (response.ok) {
    Notification({
      message: "Day Plan updated successfully",
      type: "success",
      duration: 5000,
    });
    back();
  } else {
    const data = await response.json();
    Notification({
      message: data.error || "Failed to update day plan",
      type: "error",
      duration: 5000,
    });
  }
}

// update weekly plan for the day to rest day
async function updateWeeklyPlanRestDay(
  planId: string,
  id: string,
  data: {
    name: string;
    dayOfWeek: number;
    muscleGroup: string[];
    isRestDay: boolean;
  },
) {
  const nexDay = data.dayOfWeek + 1;
  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}/update`,
    {
      headers: authHeaders(),
      body: JSON.stringify(data),
      method: "PUT",
    },
  );
  if (response.ok) {
    Notification({
      message: "Day Plan updated successifully",
      type: "success",
      duration: 5000,
    });
    back();
  } else {
    const data = await response.json();
    Notification({
      message: data.error || "Failed to update day plan",
      type: "error",
      duration: 5000,
    });
  }
}

// fetch weekly plan by id
async function fetchWeeklyPlan(
  planId: string,
  id: string,
): Promise<WeeklyPlan | null> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}`,
      {
        headers: authHeaders(),
        method: "GET",
      },
    );
    const data = await response.json();
    if (!response.ok) {
      Notification({
        message: data.error || "Failed to update weekly plan",
        type: "error",
        duration: 5000,
      });
      return null;
    }
    return data.weeklyPlan;
  } catch (error) {
    console.log("Failed to update weekly plan:", error);
    Notification({
      message: "Failed to update weekly plan",
      type: "error",
      duration: 5000,
    });
    return null;
  }
}
