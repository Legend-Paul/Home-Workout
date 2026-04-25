import styles from "./Exercises.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { type Exercise } from "../../utils/types";
import Spinner from "../../components/Spinner/Spinner";
import Notification from "../../components/Notification/Notification";
import { navigate } from "../../router";
import Header from "../../components/Header/Header";
import Exercise from "../Exercise/Exercise";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;
const token = localStorage.getItem("Authorization") || "";

export default async function Exercises() {
  const mainApp = document.getElementById("main-app");

  await Header();
  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });
  const search = window.location.search;

  let exercises: Exercise[] = await fetchExercises(search);

  mainApp!.innerHTML = `
   <div class="${styles["exercises-container"]}">
        <div class="${styles["show-aside-btn"]} ${styles["toggle-aside-btn"]}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3-3 3m-4-6l3 3-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Show Filter</p>
        </div>
        <div class="${styles["exercise-filter"]} ${styles["hide"]}"></div>
        <div class="${styles["exercise-list"]}"></div>
        <div class="${styles["exercise-container"]}"></div>        
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

  renderExerciseFilter();
  renderExerciseList(exercises);

  const addExerciseBtn = mainApp!.querySelector(
    `.${styles["add-exercise-btn"]}`,
  ) as HTMLButtonElement;

  // Navigate to new exercise page
  addExerciseBtn.addEventListener("click", () => {
    window.location.href = "/exercises/new";
  });
}

// Render all exercises
function renderExerciseList(exercises: Exercise[]) {
  const exerciseList = document.querySelector(
    `.${styles["exercise-list"]}`,
  ) as HTMLDivElement;

  exerciseList.innerHTML =
    exercises.length > 0
      ? exercises
          .map(
            (exercise: Exercise) => `
    <div class="${styles["exercise-item"]} ${exercise.isActive ? styles["active-exercise"] : styles["inactive-exercise"]}">
      <h3 class="${styles["exercise-title"]}">${exercise.name}</h3>
      <div data-exercise-id="${JSON.stringify(exercise)}" class="${styles["exercise-image"]}">
        <img  data-exercise-id="${exercise.id}" src="${exercise.imageUrl}" alt="${exercise.name}">
      </div>
      <div class="${styles["exercise-description"]}">
        <div class="${styles["exercise-preview-type"]}">
          <span data-image-url="${exercise.imageUrl}" data-exercise-id="${exercise.id}"
                class="${styles["image-preview"]} ${styles["active-preview-type"]}">Image</span>
          <span data-video-url="${exercise.videoUrl}" data-exercise-id="${exercise.id}"
                class="${styles["video-preview"]}">Video</span>
        </div>
        <div class="${styles["exercise-summary"]}">
          ${
            exercise.muscleGroup.length > 0
              ? `
            <div class="${styles["exercise-muscle"]}">
              ${exercise.muscleGroup.map((muscle) => `<p>${muscle && muscle.at(0)?.toUpperCase() + muscle.slice(1)}</p>`).join("")}
            </div>`
              : ""
          }
          ${
            exercise.equipment.length > 0
              ? `
            <div class="${styles["exercise-equipment"]}">
              ${exercise.equipment.map((eq) => `<p>${eq && eq.at(0)?.toUpperCase() + eq.slice(1)}</p>`).join("")}
            </div>`
              : ""
          }
          <p>${exercise.level}</p>
        </div>
        <div class="${styles["exercise-acions"]}">
          ${Button({
            label: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
            type: "button",
            btnClass: styles["delete-exercise"],
            data: `data-exercise-id="${exercise.id}"`,
          })}
          ${Button({
            label: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`,
            type: "button",
            btnClass: styles["update-exercise"],
            data: `data-exercise-id="${exercise.id}"`,
          })}
        </div>
      </div>
    </div>
  `,
          )
          .join("")
      : `<div class="${styles["no-exercise-container"]}">
          <p>😭 Oops! No exercises found.</p>
        </div>`;
  openExercisePage();
  changeExercisePreview();
  updateExerciseHandler();
  deleteFunctionHandler();
}

// navigate to exercise page
function openExercisePage() {
  const exerciseList = document.querySelector(
    `.${styles["exercise-list"]}`,
  ) as HTMLDivElement;
  const images = exerciseList.querySelectorAll<HTMLImageElement>("img");

  images.forEach(async (image) => {
    const exerciseId = image.dataset.exerciseId as string;
    image.addEventListener("click", () => {
      navigate(`/exercises/${exerciseId}`);
    });
  });
}

// change preview
function changeExercisePreview() {
  const mainApp = document.getElementById("main-app");
  const imagePreviewBtns = mainApp!.querySelectorAll<HTMLSpanElement>(
    `.${styles["image-preview"]}`,
  );
  const videoPreviewBtns = mainApp!.querySelectorAll<HTMLSpanElement>(
    `.${styles["video-preview"]}`,
  );
  // Preview image
  imagePreviewBtns.forEach((imageBtn: HTMLSpanElement) => {
    imageBtn.addEventListener("click", () => {
      const imageUrl = imageBtn.dataset.imageUrl;
      const card = imageBtn.closest(`.${styles["exercise-item"]}`);
      const previewContainer = card?.querySelector(
        `.${styles["exercise-image"]}`,
      ) as HTMLDivElement;
      const exercise = JSON.parse(
        previewContainer.dataset.exercise as string,
      ) as Exercise;

      previewContainer.innerHTML = `<img data-exercise-id="${exercise.id}" src="${imageUrl}" alt="exercise">`;

      // scope active state to this card only
      card
        ?.querySelector(`.${styles["video-preview"]}`)
        ?.classList.remove(styles["active-preview-type"]);
      imageBtn.classList.add(styles["active-preview-type"]);
    });
  });

  // Preview video
  videoPreviewBtns.forEach((videoBtn: HTMLSpanElement) => {
    videoBtn.addEventListener("click", () => {
      const videoUrl = videoBtn.dataset.videoUrl;
      const card = videoBtn.closest(`.${styles["exercise-item"]}`);
      const previewContainer = card?.querySelector(
        `.${styles["exercise-image"]}`,
      ) as HTMLDivElement;

      previewContainer.innerHTML = videoUrl
        ? `<video src="${videoUrl}" controls autoplay muted>
           <source src="${videoUrl}" type="video/mp4" />
        </video>`
        : `<p>Video not available</p>`;

      card
        ?.querySelector(`.${styles["image-preview"]}`)
        ?.classList.remove(styles["active-preview-type"]);
      videoBtn.classList.add(styles["active-preview-type"]);
    });
  });
}

// update exercise handler
function updateExerciseHandler() {
  const mainApp = document.getElementById("main-app");
  const updateExerciseBtns = mainApp!.querySelectorAll<HTMLButtonElement>(
    `.${styles["update-exercise"]}`,
  );

  updateExerciseBtns.forEach((updateBtn: HTMLButtonElement) => {
    updateBtn.addEventListener("click", async () => {
      const id = updateBtn.dataset.exerciseId;
      navigate(`/exercises/${id}/update`);
    });
  });
}

// delete function handler
function deleteFunctionHandler() {
  const mainApp = document.getElementById("main-app");

  const deleteExerciseBtns = mainApp!.querySelectorAll<HTMLButtonElement>(
    `.${styles["delete-exercise"]}`,
  );

  deleteExerciseBtns.forEach((deleteBtn: HTMLButtonElement) => {
    deleteBtn.addEventListener("click", async () => {
      const id = deleteBtn.dataset.exerciseId as string;
      const exercise = deleteBtn.closest(`.${styles["exercise-item"]}`);
      await deleteExercise(id, exercise);
    });
  });
}

// render exercises filter
function renderExerciseFilter() {
  const exerciseFilter = document.querySelector(
    `.${styles["exercise-filter"]}`,
  ) as HTMLDivElement;
  exerciseFilter.innerHTML = `
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
          <label for="level">Level:</label>
          <select id="${styles["level"]}">
              <option value="">All</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
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
            label: "Reset Filters",
            type: "button",
            btnClass: styles["filter-action-btn"],
          })}
          ${Button({
            label: "Apply Filters",
            type: "button",
            btnClass: styles["filter-action-btn"],
          })}
      </div>
  `;
  toggleExerciseFilter();
  filterExercises();
}

// toggle exercisefilter
function toggleExerciseFilter() {
  const mainApp = document.getElementById("main-app");
  const hideAsideBtn = mainApp!.querySelector(
    `.${styles["hide-aside-btn"]}`,
  ) as HTMLDivElement;
  const showAsideBtn = mainApp!.querySelector(
    `.${styles["show-aside-btn"]}`,
  ) as HTMLDivElement;
  const exerciseFilter = mainApp!.querySelector(
    `.${styles["exercise-filter"]}`,
  ) as HTMLDivElement;

  showAsideBtn.addEventListener("click", () => {
    exerciseFilter.classList.add(`${styles["show"]}`);
    exerciseFilter.classList.remove(`${styles["hide"]}`);
  });

  hideAsideBtn.addEventListener("click", () => {
    exerciseFilter.classList.add(`${styles["hide"]}`);
    exerciseFilter.classList.remove(`${styles["show"]}`);
  });
}

// fiter exercises
function filterExercises() {
  const mainApp = document.getElementById("main-app");
  const searchForm = mainApp!.querySelector(
    `#${styles["search-form"]}`,
  ) as HTMLFormElement;
  const searchInput = mainApp!.querySelector("#search") as HTMLInputElement;
  const muscleGroupSelect = mainApp!.querySelector(
    `#${styles["muscle-group"]}`,
  ) as HTMLSelectElement;
  const equipmentSelect = mainApp!.querySelector(
    `#${styles["equipment"]}`,
  ) as HTMLSelectElement;
  const levelSelect = mainApp!.querySelector(
    `#${styles["level"]}`,
  ) as HTMLSelectElement;
  const exerciseStatusSelect = mainApp!.querySelector(
    `#${styles["exercise-status"]}`,
  ) as HTMLSelectElement;
  const applyFiltersBtn = mainApp!.querySelector(
    `.${styles["filter-action-btn"]}:last-child`,
  ) as HTMLButtonElement;
  const resetFiltersBtn = mainApp!.querySelector(
    `.${styles["filter-action-btn"]}:first-child`,
  ) as HTMLButtonElement;

  const syncFilterFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    searchInput.value = params.get("search") || "";
    muscleGroupSelect.value = params.get("muscleGroup") || "";
    equipmentSelect.value = params.get("equipment") || "";
    levelSelect.value = params.get("level") || "";
    exerciseStatusSelect.value = params.get("exerciseStatus") || "";
  };

  const applyFilter = async () => {
    const params = new URLSearchParams();
    if (searchInput.value.trim())
      params.set("search", searchInput.value.trim());
    if (muscleGroupSelect.value)
      params.set("muscleGroup", muscleGroupSelect.value);
    if (equipmentSelect.value) params.set("equipment", equipmentSelect.value);
    if (levelSelect.value) params.set("level", levelSelect.value);
    if (exerciseStatusSelect.value)
      params.set("status", exerciseStatusSelect.value);

    const url = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.search;

    navigate(url);
    const exercises = await fetchExercises(params.toString());
    renderExerciseList(exercises);
  };

  const resetFilter = async () => {
    searchInput.value = "";
    muscleGroupSelect.value = " ";
    equipmentSelect.value = " ";
    levelSelect.value = " ";
    exerciseStatusSelect.value = " ";

    navigate(window.location.pathname);
    const exercises = await fetchExercises();
    renderExerciseList(exercises);
  };

  syncFilterFromUrl();
  applyFiltersBtn.addEventListener("click", applyFilter);
  searchForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    applyFilter();
  });
  resetFiltersBtn.addEventListener("click", resetFilter);
}

// fetch all exercises
async function fetchExercises(params?: string) {
  try {
    const response = await fetch(
      `${backendUrl}/api/exercises${params ? `?${params}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    if (!response.ok) {
      const data = await response.json();
      Notification({
        message: data.error || "Failed to fetch exercises",
        type: "error",
        duration: 5000,
      });
    }
    const data = await response.json();
    return data.exercises;
  } catch (error) {
    return [];
  }
}

// delete exercise by id
async function deleteExercise(id: string, exercise: Element | null) {
  try {
    const response = await fetch(`${backendUrl}/api/exercises/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      exercise?.remove();
      Notification({
        message: data.message || "Exercise deleted successifully",
        type: "success",
        duration: 5000,
      });
    } else {
      const data = await response.json();
      Notification({
        message: data.error || "Failed to delete exercises",
        type: "error",
        duration: 5000,
      });
    }
  } catch (error) {
    console.log(error);
    Notification({
      message: "An error occurred. Please try again.",
      type: "error",
      duration: 5000,
    });
  }
}
