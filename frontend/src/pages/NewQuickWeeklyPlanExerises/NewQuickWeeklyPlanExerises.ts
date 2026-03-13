import styles from "./NewQuickWeeklyPlanExerises.module.css";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import type { WeeklyPlan, Exercise } from "../../utils/types";
const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";

export default async function NewQuickWeeklyPlanExerises(
  params?: Record<string, string>,
) {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

  const planId = params?.planId as string;
  const id = params?.id as string;
  const weeklyPlan = await fetchWeeklyPlan(planId, id);

  const searchParams = new URLSearchParams();
  weeklyPlan?.muscleGroup.forEach((mg) =>
    searchParams.append("muscleGroup", mg),
  );
  const exercises = await fetchExercisesByMuscleGroup(searchParams.toString());

  mainApp!.innerHTML = `<div class="${styles["exercises-container"]}">
    <div class="${styles["exercises"]}">
      ${exercises
        ?.map((exercise) => {
          return `<div class="${styles["exercise-container"]}">
              <div class="${styles["exercise"]}">
                <h3>${exercise.name}</h3>
                <p>${exercise.muscleGroup
                  .map(
                    (muscleGroup: string) =>
                      muscleGroup.charAt(0).toUpperCase() +
                      muscleGroup.slice(1),
                  )
                  .join(", ")}</p>
                <p>${exercise.equipment
                  .map(
                    (equiment) =>
                      equiment.charAt(0).toUpperCase() + equiment.slice(1),
                  )
                  .join(", ")}</h3>
              </div>
          </div>`;
        })
        .join("")}
    </div>
  </div>`;
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
