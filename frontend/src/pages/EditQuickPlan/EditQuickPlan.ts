import styles from "../NewQuickPlan/NewQuickPlan.module.css";
import formStyles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { type Goal, type Level } from "../../utils/types";
import Notification from "../../components/Notification/Notification";
import { back, navigate } from "../../router";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

export default async function EditQuickPlan(params?: Record<string, string>) {
  const mainApp = document.getElementById("main-app");

  const id = params?.id ?? "";
  console.log(id);
  const plan = await getQuickPlanById(id);
  console.log(plan);

  mainApp!.innerHTML = `
    <div class="${styles["new-quick-plan-container"]}">
      <div class="${formStyles["auth-form-container"]}">
          <h2>🏋️ Update quick plan!</h2>
          ${Button({
            label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg> <span>Back</span>`,
            type: "button",
            btnClass: styles["back-btn"],
          })}
      </div>
      <div class="${formStyles["res-error-message"]}"></div>
        <form id="${formStyles["auth-form"]}" method="POST">
                ${Input({
                  label: "Name",
                  id: "name",
                  type: "input",
                  placeholder: "e.g Destroyer",
                  name: "name",
                  required: true,
                  minLength: 3,
                  errorMessage: "Name must be at least 3 characters",
                  value: plan?.name ?? "",
                })}
                <div class="${styles["quick-plan-radio-container"]} ${styles["quick-plan-level-container"]}">
                    <h3>Select quick plan level</h3>
                    <div class="${styles["quick-plan-radio"]}">
                        ${levelRadioInput("All", plan.level === "ALL")}
                        ${levelRadioInput("Beginner", plan.level === "BEGINNER")}
                        ${levelRadioInput("Intermediate", plan.level === "INTERMEDIATE")}
                        ${levelRadioInput("Advanced", plan.level === "ADVANCED")}
                                 
                    </div>
                </div>
                <div class="${styles["quick-plan-radio-container"]} ${styles["quick-plan-level-container"]}">
                    <h3>Select quick plan goal</h3>
                    <div class="${styles["quick-plan-radio"]}">   
                    ${goalRadioInput("Build Muscle", plan.goal === "BUILD_MUSCLE")}                     
                    ${goalRadioInput("Lose Fat", plan.goal === "LOSE_FAT")}                     
                    ${goalRadioInput("Maintain Fitness", plan.goal === "MAINTAIN_FITNESS")}  
                    </div>
                </div>
           
            ${Button({
              label: "Update Quick Plan",
              type: "submit",
              btnClass: styles["create-quick-plan"],
            })}

        </form>
    </div>
    `;

  const newQuickPlanContainer = mainApp!.querySelector(
    `.${styles["new-quick-plan-container"]}`,
  ) as HTMLDivElement;
  const newQuickPlanForm = newQuickPlanContainer!.querySelector(
    `#${formStyles["auth-form"]}`,
  ) as HTMLFormElement;
  const nameInput = newQuickPlanContainer!.querySelector(
    "#name",
  ) as HTMLInputElement;
  const submitButton = newQuickPlanContainer!.querySelector(
    `.${styles["create-quick-plan"]}`,
  ) as HTMLButtonElement;
  const backBtn = document.querySelector(
    `.${styles["back-btn"]}`,
  ) as HTMLButtonElement;

  nameInput.addEventListener("input", validateForm);
  newQuickPlanContainer!
    .querySelectorAll("input[name=level]")
    .forEach((el) => el.addEventListener("change", validateForm));
  newQuickPlanContainer!
    .querySelectorAll("input[name=goal]")
    .forEach((el) => el.addEventListener("change", validateForm));

  const getCheckedLevel = () =>
    (
      newQuickPlanContainer!.querySelector(
        "input[name=level]:checked",
      ) as HTMLInputElement
    )?.value;

  const getCheckedGoal = () =>
    (
      newQuickPlanContainer!.querySelector(
        "input[name=goal]:checked",
      ) as HTMLInputElement
    )?.value;
  backBtn.addEventListener("click", back);

  validateForm();

  function validateForm() {
    const name = nameInput.value.trim();
    const level = getCheckedLevel() as Level;
    const goal = getCheckedGoal() as Goal;

    if (name.length >= 3 && level && goal) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark)";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "var(--primary-light)";
    }
  }

  newQuickPlanForm.addEventListener("submit", handleCreateNewQuickPlan);

  async function handleCreateNewQuickPlan(e: Event) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const level = getCheckedLevel() as Level;
    const goal = getCheckedGoal() as Goal;

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "var(--primary-light) !important";
    submitButton.innerHTML = `${Spinner({})}  Updating...`;

    try {
      await createNewQuickPlan({ name, level, goal, isActive: true });
    } catch (error) {
      console.error("Error updating quick pla:", error);
      Notification({
        message: "An error occurred. Please try again",
        type: "error",
        duration: 5000,
      });
    } finally {
      submitButton.innerHTML = "Update Quick Plan";
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    }
  }
}

function levelRadioInput(label: string, checked = false) {
  return Input({
    label,
    id: label.toLowerCase(),
    type: "radio",
    placeholder: "",
    name: "level",
    minLength: 3,
    errorMessage: "",
    checked,
    value: label.toUpperCase(),
  });
}

function goalRadioInput(label: string, checked = false) {
  return Input({
    label,
    id: label.toLowerCase(),
    type: "radio",
    placeholder: "",
    name: "goal",
    minLength: 3,
    errorMessage: "",
    checked,
    value: label.toUpperCase().split(" ").join("_"),
  });
}

async function createNewQuickPlan(data: {
  name: string;
  level: Level;
  goal: Goal;
  isActive: boolean;
}) {
  const response = await fetch(`${backendUrl}/api/quick-plans/new`, {
    headers: authHeaders(),
    body: JSON.stringify(data),
    method: "POST",
  });
  if (response.ok) {
    Notification({
      message: "Quick plan created successifully",
      type: "success",
      duration: 5000,
    });
    navigate("/api/quick-plans");
  } else {
    const data = await response.json();
    Notification({
      message: data.error || "Failed to create quick plan",
      type: "error",
      duration: 5000,
    });
  }
}

async function getQuickPlanById(id: string) {
  try {
    const response = await fetch(`${backendUrl}/api/quick-plans/${id}`, {
      headers: authHeaders(),
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      Notification({
        message: data.error || "Failed to get quick plan by id",
        type: "error",
        duration: 5000,
      });
      return null;
    }
    return data.quickPlan;
  } catch (error) {
    console.log("Failed to get quick plan by id:", error);
    Notification({
      message: "Failed to get quick plan by id",
      type: "error",
      duration: 5000,
    });
    return null;
  }
}
