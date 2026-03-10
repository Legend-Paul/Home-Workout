import styles from "./NewQuickPlan.module.css";
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

export default function NewQuickPlan() {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = `
    <div class="${styles["new-quick-plan-container"]}">
      <div class="${formStyles["auth-form-container"]}">
          <h2>🏋️ Create New quick plan!</h2>
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
                })}
                <div class="${styles["quick-plan-radio-container"]} ${styles["quick-plan-level-container"]}">
                    <h3>Select quick plan level</h3>
                    <div class="${styles["quick-plan-radio"]}">
                        ${Input({
                          label: "All",
                          id: "all",
                          type: "radio",
                          placeholder: "",
                          name: "level",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: true,
                          value: "ALL",
                        })}
                        ${Input({
                          label: "Beginner",
                          id: "beginner",
                          type: "radio",
                          placeholder: "",
                          name: "level",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: false,
                          value: "BEGINNER",
                        })}
                        ${Input({
                          label: "Intermediate",
                          id: "intermediate",
                          type: "radio",
                          placeholder: "",
                          name: "level",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: false,
                          value: "INTERMEDIATE",
                        })}
                        ${Input({
                          label: "Advanced",
                          id: "advanced",
                          type: "radio",
                          placeholder: "",
                          name: "level",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: false,
                          value: "ADVANCED",
                        })}           
                    </div>
                </div>
                <div class="${styles["quick-plan-radio-container"]} ${styles["quick-plan-level-container"]}">
                    <h3>Select quick plan goal</h3>
                    <div class="${styles["quick-plan-radio"]}">                        
                        ${Input({
                          label: "Build Muscle",
                          id: "build-muscle",
                          type: "radio",
                          placeholder: "",
                          name: "goal",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: true,
                          value: "BUILD_MUSCLE",
                        })}
                        ${Input({
                          label: "Lose Fat",
                          id: "lose-fat",
                          type: "radio",
                          placeholder: "",
                          name: "goal",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: false,
                          value: "LOSE_FAT",
                        })}
                        ${Input({
                          label: "Maintain Fitness",
                          id: "maintain-fitness",
                          type: "radio",
                          placeholder: "",
                          name: "goal",
                          required: true,
                          minLength: 3,
                          errorMessage: "",
                          checked: false,
                          value: "MAINTAIN_FITNESS",
                        })}           
                    </div>
                </div>
           
            ${Button({
              label: "Create New Quick Plan",
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
    submitButton.innerHTML = `${Spinner({})}  Creating...`;

    try {
      await createNewQuickPlan({ name, level, goal, isActive: true });
    } catch (error) {
      console.error("Error Creating quick pla:", error);
      Notification({
        message: "An error occurred. Please try again",
        type: "error",
        duration: 5000,
      });
    } finally {
      submitButton.innerHTML = "Create New Quick Plan";
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    }
  }
}
async function createNewQuickPlan(data: {
  name: string;
  level: Level;
  goal: Goal;
  isActive: boolean;
}) {
  const response = await fetch(`${backendUrl}/api/quick-plans/new`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
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
