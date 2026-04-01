import Notification from "../../components/Notification/Notification";
import type { WeeklyPlan } from "../../utils/types";

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

const authHeaders = () => {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
};

export default async function WeeklyPlan(params?: {
  planId: string;
  id: string;
}) {
  const { planId, id } = params || { planId: "", id: "" };

  const plan = await fetchWeeklyPlanById(planId, id);
  console.log("Fetched Weekly Plan:", plan);
  const mainApp = document.getElementById("main-app")!;
  mainApp.innerHTML = `
    <h1>Weekly Plan</h1>
    <p>This is the Weekly Plan page. Here you can view and manage your weekly workout plans.</p>
  `;
}

async function fetchWeeklyPlanById(
  planId: string,
  id: string,
): Promise<WeeklyPlan | null> {
  try {
    const response = await fetch(
      `${backendUrl}/api/quick-plans/${planId}/weekly-plans/${id}`,
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
    return json.weeklyPlan;
  } catch (error) {
    return null;
  }
}
