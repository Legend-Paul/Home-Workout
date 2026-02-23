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

  mainApp!.innerHTML = `
   <div class="${styles["exercises-container"]}">
        <div class="${styles["show-aside-btn"]} ${styles["toggle-aside-btn"]}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3-3 3m-4-6l3 3-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Show Filter</p>
        </div>
        <div class="${styles["exercise-filter"]} ${styles["hide"]}"> 
            <div class="${styles["toggle-aside-btn"]} ${styles["hide-aside-btn"]}">
                <svg fill="none" stroke="currentColor" 
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" 
                    stroke-linejoin="round" stroke-width="2" 
                    d="M11 15l-3-3 3-3m4 6l-3-3 3-3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Hide Filter</p>
            </div>
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
                        <div class="${styles["exercise-item"]}
                         ${exercise.isActive ? styles["active-exercise"] : styles["inactiv-exercise"]}">
                            <h3 class="${styles["exercise-title"]}">
                                ${exercise.name}</h3>
                            <div class="${styles["exercise-image"]}">
                                <img src="${logo}" alt="Push-up">
                            </div>
                            <div class="${styles["exercise-description"]}">
                                <div class="${styles["exercise-preview-type"]}">
                                    <span data-image-url="${exercise.imageUrl}" 
                                        class="${styles["image-preview"]} 
                                        ${styles["active-preview-type"]}">Image
                                    </span>
                                    <span data-video-url="${exercise.videoUrl}"
                                        class="${styles["video-preview"]}">Video
                                    </span>
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
         ${Button({
           label: `
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              <p> Add Exercise </p>`,
           addBtn: true,
           btnClass: styles["add-exercise-btn"],
         })}
    </div>
  `;
  const imagePreviewBtn = mainApp!.querySelector(
    `.${styles["image-preview"]}`,
  ) as HTMLSpanElement;
  const videoPreviewBtn = mainApp!.querySelector(
    `.${styles["video-preview"]}`,
  ) as HTMLSpanElement;
  const previewContainer = mainApp!.querySelector(
    `.${styles["exercise-image"]}`,
  ) as HTMLDivElement;
  const hideAsideBtn = mainApp!.querySelector(
    `.${styles["hide-aside-btn"]}`,
  ) as HTMLDivElement;
  const showAsideBtn = mainApp!.querySelector(
    `.${styles["show-aside-btn"]}`,
  ) as HTMLDivElement;
  const exerciseFilter = mainApp!.querySelector(
    `.${styles["exercise-filter"]}`,
  ) as HTMLDivElement;
  const addExerciseBtn = mainApp!.querySelector(
    `.${styles["add-exercise-btn"]}`,
  ) as HTMLButtonElement;

  imagePreviewBtn?.addEventListener("click", () => {
    const imageUrl = imagePreviewBtn.dataset.imageUrl;
    previewContainer!.innerHTML = `<img src="${imageUrl ? imageUrl : logo}" alt="Push-up">`;
  });

  videoPreviewBtn?.addEventListener("click", () => {
    const videoUrl = videoPreviewBtn.dataset.videoUrl;
    if (videoUrl)
      previewContainer!.innerHTML = `<video src="${videoUrl}" controls autoplay muted>
                    Your browser does not support the video tag.
                </video> `;
    else
      previewContainer!.innerHTML = `<p>Video not available at the moment!</p> `;
  });

  showAsideBtn.addEventListener("click", () => {
    exerciseFilter.classList.add(`${styles["show"]}`);
    exerciseFilter.classList.remove(`${styles["hide"]}`);
    console.log("clicked");
  });

  hideAsideBtn.addEventListener("click", () => {
    exerciseFilter.classList.add(`${styles["hide"]}`);
    exerciseFilter.classList.remove(`${styles["show"]}`);
  });

  addExerciseBtn.addEventListener("click", () => {
    window.location.href = "/api/exercises/new";
  });
}

async function fetchExercises() {
  try {
    const response = await fetch(`${backendUrl}/api/exercises`, {
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
    return [];
  }
}
