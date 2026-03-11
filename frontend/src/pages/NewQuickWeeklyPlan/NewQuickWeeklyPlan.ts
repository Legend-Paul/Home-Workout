import styles from "./NewQuickWeeklyPlan.module.css";
import formStyles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import { navigate } from "../../router";
import Spinner from "../../components/Spinner/Spinner";

const daysOfWeek: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";

export default function NewQuickWeeklyPlan(params?: Record<string, string>) {
  const mainApp = document.getElementById("main-app");

  const dayIndex: string | null = new URLSearchParams(
    window.location.search,
  ).get("day");
  const planId = params?.planId as string;
  const day = dayIndex ? daysOfWeek[Number(dayIndex)] : daysOfWeek[0];
  console.log(dayIndex, window.location.search);

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
            <form id="${formStyles["auth-form"]}" class="${styles["form"]} ${styles["show-form"]}" method="POST">
                    ${Input({
                      label: "Name",
                      id: "name",
                      type: "input",
                      placeholder: "e.g Destroyer",
                      name: "name",
                      required: true,
                      minLength: 3,
                      errorMessage: "Name must be at least 3 characters",
                    })}
                    <div class="${styles["weekly-plan-checkbox-container"]} ${styles["weekly-plan-level-container"]}">
                        <h3>Select Musle Group</h3>
                        <div class="${styles["weekly-plan-checkbox"]}">
                            ${Input({
                              label: "Chest",
                              id: "chest",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              errorMessage: "",
                              checked: false,
                              value: "chest",
                            })}
                            ${Input({
                              label: "Lats",
                              id: "lats",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "lats",
                            })}
                            ${Input({
                              label: "Traps",
                              id: "traps",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "traps",
                            })}
                            ${Input({
                              label: "Back",
                              id: "back",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "back",
                            })}
                            ${Input({
                              label: "Shoulder",
                              id: "shoulder",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "shoulder",
                            })}  
                            ${Input({
                              label: "Biceps",
                              id: "biceps",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "biceps",
                            })} 
                            ${Input({
                              label: "Triceps",
                              id: "triceps",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "triceps",
                            })}  
                            ${Input({
                              label: "Legs",
                              id: "legs",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "legs",
                            })} 
                            ${Input({
                              label: "Abs",
                              id: "abs",
                              type: "checkbox",
                              placeholder: "",
                              name: "level",
                              minLength: 3,
                              errorMessage: "",
                              checked: false,
                              value: "abs",
                            })}   
                        </div>     
                    </div>    
                
                    ${Button({
                      label: `Create ${day} Plan`,
                      type: "submit",
                      btnClass: styles["create-weekly-plan"],
                    })}                
            </form>
            <div class="${styles["rest-day-message"]} ${styles["hide-rest"]}">
                <p>Rest, recharge, and reflect. Sometimes the most productive thing you can do is relax. </p>
                ${Button({
                  label: `Create ${day} Plan`,
                  btnClass: styles["create-rest-day"],
                })}
            </div>
        </div>
    </div>
    `;

  changeDayStatusDisplay();
  validateForm();
  createRestDay(planId, Number(dayIndex));
  createWeeklyPlanDay(planId, Number(dayIndex));
}

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

function validateForm() {
  const weeklyPlanContainer = document.querySelector(
    `.${styles["new-weekly-plan-container"]}`,
  ) as HTMLDivElement;
  const nameInput = weeklyPlanContainer!.querySelector(
    "#name",
  ) as HTMLInputElement;
  const createWeeklyPlanBtn = weeklyPlanContainer!.querySelector(
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

  nameInput.addEventListener("change", validate);

  function validate() {
    const name = nameInput.value.trim();
    const muscleGroup = getCheckedMuscleGroup();

    if (name.length >= 3 && muscleGroup.length > 0) {
      createWeeklyPlanBtn.disabled = false;
      createWeeklyPlanBtn.style.backgroundColor = "var(--primary-dark)";
    } else {
      createWeeklyPlanBtn.disabled = true;
      createWeeklyPlanBtn.style.backgroundColor = "var(--primary-light)";
    }
  }
}

function createRestDay(planId: string, day: number) {
  const weeklyPlanContainer = document.querySelector(
    `.${styles["new-weekly-plan-container"]}`,
  ) as HTMLDivElement;
  const createRestDayBtn = weeklyPlanContainer!.querySelector(
    `.${styles["create-rest-day"]}`,
  ) as HTMLButtonElement;

  const createRestDayHandler = async () => {
    const data = {
      name: "Rest Day",
      dayOfWeek: day,
      muscleGroup: [],
      isRestDay: true,
    };
    createRestDayBtn.disabled = true;
    createRestDayBtn.style.backgroundColor = "var(--primary-light) !important";
    createRestDayBtn.innerHTML = `${Spinner({})}  Creating...`;
    try {
      await createWeeklyPlanRestDay(planId, data);
    } catch (error) {
      console.log("Failed to create rest day:", error);
    } finally {
      createRestDayBtn.innerHTML = `Create ${daysOfWeek[day]} Plan`;
      createRestDayBtn.disabled = false;
      createRestDayBtn.style.backgroundColor = "var(--primary-dark) !important";
    }
  };

  createRestDayBtn?.addEventListener("click", createRestDayHandler);
}

function createWeeklyPlanDay(planId: string, day: number) {
  const weeklyPlanContainer = document.querySelector(
    `.${styles["new-weekly-plan-container"]}`,
  ) as HTMLDivElement;
  const nameInput = weeklyPlanContainer!.querySelector(
    "#name",
  ) as HTMLInputElement;
  const form = weeklyPlanContainer!.querySelector(
    `.${styles["form"]}`,
  ) as HTMLFormElement;
  const createWeeklyPlanBtn = weeklyPlanContainer!.querySelector(
    `.${styles["create-weekly-plan"]}`,
  ) as HTMLButtonElement;

  const getCheckedMuscleGroup = (): string[] => {
    const checkedElements =
      weeklyPlanContainer!.querySelectorAll<HTMLInputElement>(
        "input[type='checkbox']:checked",
      );
    return Array.from(checkedElements).map((checkbox) => checkbox.value);
  };

  const createWeeklyPlanDayHandler = async (e: Event) => {
    e.preventDefault();
    console.log("Submitting...");
    const name = nameInput.value.trim();
    const muscleGroup = getCheckedMuscleGroup();

    const data = {
      name,
      dayOfWeek: day,
      muscleGroup,
    };

    createWeeklyPlanBtn.disabled = true;
    createWeeklyPlanBtn.style.backgroundColor =
      "var(--primary-light) !important";
    createWeeklyPlanBtn.innerHTML = `${Spinner({})}  Creating...`;

    try {
      await createWeeklyPlan(planId, data);
    } catch (error) {
      console.log("Failed to create rest day:", error);
    } finally {
      createWeeklyPlanBtn.innerHTML = `Create ${daysOfWeek[day]} Plan`;
      createWeeklyPlanBtn.disabled = false;
      createWeeklyPlanBtn.style.backgroundColor =
        "var(--primary-dark) !important";
    }
  };
  console.log("form", form);
  form.addEventListener("submit", createWeeklyPlanDayHandler);
}

async function createWeeklyPlan(
  planId: string,
  data: {
    name: string;
    dayOfWeek: number;
    muscleGroup: string[];
  },
) {
  console.log(data);
  const nexDay = data.dayOfWeek + 1;

  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/new`,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    },
  );
  if (response.ok) {
    const data = await response.json();
    const weeklyPlanId = data.plan.id;
    Notification({
      message: "Day Plan created successfully",
      type: "success",
      duration: 5000,
    });
    navigate(
      `/api/quick-plans/${planId}/weekly-plans/${weeklyPlanId}/exercises/new?day=${nexDay}`,
    );
  } else {
    const data = await response.json();
    Notification({
      message: data.error || "Failed to create day plan",
      type: "error",
      duration: 5000,
    });
  }
}

async function createWeeklyPlanRestDay(
  planId: string,
  data: {
    name: string;
    dayOfWeek: number;
    muscleGroup: string[];
    isRestDay: boolean;
  },
) {
  const nexDay = data.dayOfWeek + 1;
  const response = await fetch(
    `${backendUrl}/api/quick-plans/${planId}/weekly-plans/new`,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    },
  );
  if (response.ok) {
    Notification({
      message: "Day Plan created successifully",
      type: "success",
      duration: 5000,
    });
    navigate(`/api/quick-plans/${planId}/weekly-plans/new?day=${nexDay}`);
  } else {
    const data = await response.json();
    Notification({
      message: data.error || "Failed to create day plan",
      type: "error",
      duration: 5000,
    });
  }
}
