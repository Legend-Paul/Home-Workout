import styles from "./QuickPlan.module.css";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import type {
  Exercise,
  Goal,
  Level,
  QuickPlan,
  WeeklyPlan,
  Plan,
} from "../../utils/types";
import { back, navigate } from "../../router";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;
const token = localStorage.getItem("Authorization") || "";

// Create header content-type and authorization
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

export default async function QuickPlan() {
  const mainApp = document.getElementById("main-app");
  const plans = await fetchAllPlans();

  mainApp!.innerHTML = `
    <div class="${styles["plans-container"]}">
      <h2 class="${styles["title"]}">Quick Plans</h2>
    </div>
  `;
  const container = document.querySelector<HTMLDivElement>(
    `.${styles["plans-container"]}`,
  )!;
  renderPage(container, plans);
}

function renderPage(container: HTMLDivElement, plans: Plan[]) {
  const existing = container.querySelector(`.${styles["plans-list"]}`);
  existing?.remove();

  const plansComponent = renderQuickPlans(plans);
  container.appendChild(plansComponent);
  attachAllEventHandlers(container, plans);
}

// render quick plans
function renderQuickPlans(plans: Plan[]) {
  const plansList = document.createElement("div");
  plansList.className = styles["plans-list"];

  plans.forEach((plan) => {
    const planCard = document.createElement("div");
    planCard.className = `${styles["plan-card"]} ${!plan.isActive ? styles["deactive"] : ""}`;
    planCard.setAttribute("data-plan-id", plan.id);

    planCard.innerHTML = `
      <div class="${styles["plan-heading"]}">
        <h3 class="${styles["plan-name"]}">${plan.name}</h3>
        <p class="${styles["plan-goal"]}">${plan.goal}</p>
      </div>
      <div class="${styles["plan-days-exercises"]}">
        <span class="${styles["plan-days"]}">Days: ${plan.activeDays}</span>
        <span class="${styles["plan-exercises"]}">Exercises: ${plan.totalExercises}</span>
      </div>
      <div class="${styles["plan-footer"]}">
        <div class="${styles["chips-container"]}">
          <span class="${styles["plan-chip"]} ${styles[plan.level.toLowerCase()]}">${plan.level}</span>
          ${
            plan.isActive
              ? `<span class="${styles["plan-chip"]} ${styles["active-plan"]}" data-plan-id="${plan.id}">
            Deactivate </span>`
              : `<span class="${styles["plan-chip"]} ${styles["deactive-plan"]}" data-plan-id="${plan.id}">
            Activate</span>`
          }
        </div>
        <div class="${styles["plan-actions"]}">
          ${Button({
            label: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>`,
            btnClass: `${styles["action-btn"]} ${styles["edit-btn"]}`,
            data: `data-plan-id="${plan.id}"`,
          })}
          ${Button({
            label: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>`,
            btnClass: `${styles["action-btn"]} ${styles["delete-btn"]}`,
            data: `data-plan-id="${plan.id}"`,
          })}
        </div>
      </div>
    `;

    plansList.appendChild(planCard);
  });

  return plansList;
}

/* event handlers */
function attachAllEventHandlers(container: HTMLDivElement, plans: Plan[]) {
  editQuickPlansHandler();
  deactivateQuickPlanHandler(container, plans);
  activateQuickPlanHandler(container, plans);
  deleteQuickPlanHandler(container, plans);
}

// edit quick plan handler
function editQuickPlansHandler() {
  const editButtons = document.querySelectorAll<HTMLButtonElement>(
    `.${styles["edit-btn"]}`,
  );

  const editPlansHandler = (btn: HTMLButtonElement) => {
    const planId = btn.dataset.planId;
    navigate(`/api/quick-plans/${planId}/edit`);
  };

  editButtons.forEach((btn) =>
    btn.addEventListener("click", () => editPlansHandler(btn)),
  );
}

// Deactivate plan handler
function deactivateQuickPlanHandler(container: HTMLDivElement, plans: Plan[]) {
  const deactivateQuickPlanBtns = document.querySelectorAll<HTMLSpanElement>(
    `.${styles["active-plan"]}`,
  );
  const deactivateQuickPlan = async (btn: HTMLSpanElement) => {
    const planId = btn.dataset.planId as string;
    btn.innerHTML = `${Spinner({})} Deactivating...`;
    // btn.removeEventListener("click", deactivateQuickPlan)

    try {
      await deactivatPlan(planId);
      const newPlans: Plan[] =
        plans.map((plan) => {
          if (plan.id === planId) plan.isActive = false;
          return plan;
        }) ?? [];

      renderPage(container, newPlans);
    } catch (error) {
      console.log("Error deactivating quick plan", error);
      Notification({
        message: "An error occurred. Please try again.",
        type: "error",
        duration: 5000,
      });

      btn.innerHTML = `Deactivate`;
    }
  };

  deactivateQuickPlanBtns.forEach((btn: HTMLSpanElement) =>
    btn.addEventListener("click", () => deactivateQuickPlan(btn)),
  );
}

// activate plan handler
function activateQuickPlanHandler(container: HTMLDivElement, plans: Plan[]) {
  const activateQuickPlanBtns = document.querySelectorAll<HTMLSpanElement>(
    `.${styles["deactive-plan"]}`,
  );
  const activateQuickPlan = async (btn: HTMLSpanElement) => {
    const planId = btn.dataset.planId as string;
    btn.innerHTML = `${Spinner({})} Activating...`;
    // btn.removeEventListener("click", activateQuickPlan)

    try {
      await activatePlan(planId);
      const newPlans: Plan[] =
        plans.map((plan) => {
          if (plan.id === planId) plan.isActive = true;
          return plan;
        }) ?? [];

      renderPage(container, newPlans);
    } catch (error) {
      console.log("Error deactivating quick plan", error);
      Notification({
        message: "An error occurred. Please try again.",
        type: "error",
        duration: 5000,
      });

      btn.innerHTML = `Activate`;
    }
  };

  activateQuickPlanBtns.forEach((btn: HTMLSpanElement) =>
    btn.addEventListener("click", () => activateQuickPlan(btn)),
  );
}

// delete quick plan
function deleteQuickPlanHandler(container: HTMLDivElement, plans: Plan[]) {
  const deleteBtns = document.querySelectorAll<HTMLButtonElement>(
    `.${styles["delete-btn"]}`,
  );

  const deleteQuickPlan = async (btn: HTMLButtonElement): Promise<boolean> => {
    const planId = btn.dataset.planId as string;
    btn.innerHTML = `${Spinner({})}`;
    btn.disabled = true;

    try {
      await deletePlan(planId);
      const newPlans: Plan[] =
        plans.filter((plan) => {
          if (plan.id !== planId) return plan;
        }) ?? [];
      renderPage(container, newPlans);
      return true;
    } catch (error) {
      console.log("Error deactivating quick plan", error);
      Notification({
        message: "An error occurred. Please try again.",
        type: "error",
        duration: 5000,
      });

      btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>`;

      return false;
    }
  };

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      ConfirmationDialog({
        container,
        message: "Are you sure you want to delete this exercise?",
        onConfirm: () => deleteQuickPlan(btn),
      }),
    );
  });
}

/* API calls */
async function fetchAllPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${backendUrl}/api/quick-plans`, {
      headers: authHeaders(),
      method: "GET",
    });

    if (!response.ok) {
      const data = await response.json();
      Notification({
        message: data.error || "Failed to fetch quick plans",
        type: "error",
        duration: 5000,
      });
    }
    const data = await response.json();
    return data.plans;
  } catch (error) {
    return [];
  }
}

// Deactivate quick plan
async function deactivatPlan(id: string) {
  const response = await fetch(
    `${backendUrl}/api/quick-plans/${id}/deactivate`,
    {
      headers: authHeaders(),
      method: "PUT",
    },
  );
  const data = await response.json();

  if (response.ok) {
    Notification({
      message: data.message || "Quick plan deactivated successfully",
      type: "success",
      duration: 5000,
    });
  } else {
    Notification({
      message: data.error || "Failed to deactivate day plan",
      type: "error",
      duration: 5000,
    });
  }
}

// activate quick plan
async function activatePlan(id: string) {
  const response = await fetch(`${backendUrl}/api/quick-plans/${id}/activate`, {
    headers: authHeaders(),
    method: "PUT",
  });
  const data = await response.json();

  if (response.ok) {
    Notification({
      message: data.message || "Quick plan activated successfully",
      type: "success",
      duration: 5000,
    });
  } else {
    Notification({
      message: data.error || "Failed to activate day plan",
      type: "error",
      duration: 5000,
    });
  }
}

// activate quick plan
async function deletePlan(id: string) {
  const response = await fetch(`${backendUrl}/api/quick-plans/${id}/delete`, {
    headers: authHeaders(),
    method: "DELETE",
  });
  const data = await response.json();

  if (response.ok) {
    Notification({
      message: data.message || "Quick plan activated successfully",
      type: "success",
      duration: 5000,
    });
  } else {
    Notification({
      message: data.error || "Failed to activate day plan",
      type: "error",
      duration: 5000,
    });
  }
}
