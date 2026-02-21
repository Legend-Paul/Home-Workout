import styles from "./Exercises.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import logo from "../../assets/logo.png";
import { type Exercise } from "../../utils/types";
import Spinner from "../../components/Spinner/Spinner";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

export default async function Exercises() {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

  const exercises = await fetchExercises();
  console.log(exercises);

  mainApp!.innerHTML = `
   <div class="${styles["exercises-container"]}">
        <div class="${styles["exercise-filter"]}">             
            <form id="${styles["search-form"]}">
                ${Input({
                  id: "search",
                  name: "search",
                  placeholder: "Search exercises...",
                  label: "",
                })}
                ${Button({
                  label: `
                    <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>`,
                  type: "submit",
                })}                
            </form>
          
            <h2>Filter Exercises</h2>            
            <div class="${styles["filter-group"]}">
                <label for="muscle-group">Muscle Group:</label>
                <select id="${styles["muscle-group"]}">
                    <option value="">All</option>
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                    <option value="arms">Arms</option>
                    <option value="shoulders">Shoulders</option>
                </select>
            </div>
            <div class="${styles["filter-group"]}">
                <label for="equipment">Equipment:</label>
                <select id="${styles["equipment"]}">
                    <option value="">All</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="barbell">Barbell</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="machine">Machine</option>
                </select>
            </div>
            <div class="${styles["filter-group"]}">
                <label for="difficulty">Difficulty:</label>
                <select id="${styles["difficulty"]}">
                    <option value="">All</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
            <div class="${styles["filter-group"]}">
                <label for="exercise-status">Exercise status:</label>
                <select id="${styles["exercise-status"]}">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <div class="${styles["filter-actions"]}">
                ${Button({
                  label: "Apply Filters",
                  type: "button",
                  btnClass: styles["filter-action-btn"],
                })}
                ${Button({
                  label: "Reset Filters",
                  type: "button",
                  btnClass: styles["filter-action-btn"],
                })}
            </div>
        </div>
        <div class="${styles["exercise-list"]}">
                ${exercises
                  .map((exercise: Exercise) => {
                    return `
                        <div class="${styles["exercise-item"]}">
                            <div class="${styles["exercise-image"]}">
                                <img src="${logo}" alt="Push-up">
                                <h3 class="${styles["exercise-title"]}">
                                    ${exercise.name}</h3>
                            </div>
                            <div class="${styles["exercise-description"]}">
                                <div class="${styles["exercise-preview-type"]}">
                                    <span class="${styles["active-preview-type"]}">Image</span>
                                    <span>Video</span>
                                </div>
                                
                                <div class="${styles["exercise-summary"]}">
                                    ${
                                      exercise.muscleGroup.length > 0
                                        ? ` <div class="${styles["exercise-muscle"]}">
                                            ${exercise.muscleGroup
                                              .map((muscle) => {
                                                return `<p>${muscle}</p>`;
                                              })
                                              .join("")}
                                        </div>`
                                        : ""
                                    }
                                    ${
                                      exercise.equipment.length > 0
                                        ? `<div class="${styles["exercise-equipment"]}">
                                            ${exercise.equipment
                                              .map((equipment) => {
                                                return `p>${equipment}</p>`;
                                              })
                                              .join("")}
                                        </div>`
                                        : ""
                                    }
                                    
                                    <p>${exercise.level}</p>
                                </div>
                                <div class="${styles["exercise-acions"]}">
                                    ${Button({
                                      label: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>`,
                                      type: "button",
                                    })}
                                    ${Button({
                                      label: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                            </svg>`,
                                      type: "button",
                                    })}
                                </div>
                            </div>
                        </div>
                    `;
                  })
                  .join("")}
        </div>
    </div>
  `;
}

async function fetchExercises() {
  try {
    const response = await fetch(`${backendUrl}/api/exercise`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }
    const data = await response.json();
    return data.exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}
