import Spinner from "../../components/Spinner/Spinner";
import Notification from "../../components/Notification/Notification";
import Button from "../../components/Button/Button";
import { navigate } from "../../router";
import styles from "./Exercise.module.css";
import { back } from "../../router";
import Header from "../../components/Header/Header";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";

export default async function Exercise(params?: Record<string, string>) {
  const mainApp = document.getElementById("main-app");

  const id = params ? params.id : "";

  await Header();
  mainApp!.innerHTML = Spinner({
    type: "large",
    message: "Loading...",
  });

  const exercise = await fetchExercise(id);
  mainApp!.innerHTML = `
    <div class="${styles["exercise"]}">
      <div class="${styles["exercise-item"]} 
      ${exercise?.isActive ? styles["active-exercise"] : styles["inactive-exercise"]}">
        <h3 class="${styles["exercise-title"]}">${exercise.name}</h3>
        <div class="${styles["exercise-image"]}">
          <img src="${exercise.imageUrl}" alt="${exercise.name}">
        </div>
        <div class="${styles["exercise-description"]}">
          <div class="${styles["exercise-preview-container"]}">
            <div class="${styles["exercise-preview-type"]}">
              <span data-image-url="${exercise.imageUrl}" data-exercise-id="${exercise.id}"
                    class="${styles["image-preview"]} ${styles["active-preview-type"]}">Image</span>
              <span data-video-url="${exercise.videoUrl}" data-exercise-id="${exercise.id}"
                    class="${styles["video-preview"]}">Video</span>
              </div>
                  <p class="${styles["level"]}">${exercise.level}</p>
          </div>

          <div class="${styles["exercise-summary"]}">
            ${
              exercise.muscleGroup.length > 0
                ? `
                <details class="${styles["exercise-muscle"]}" open>
                  <summary>Muscle Group:</summary>
                ${exercise.muscleGroup
                  .map(
                    (muscle: string) => `
                  <p>${muscle && muscle.at(0)?.toUpperCase() + muscle.slice(1)}</p>`,
                  )
                  .join("")}
              </details>`
                : ""
            }
            ${
              exercise.equipment.length > 0
                ? `
                <details class="${styles["exercise-equipment"]}" open>
                  <summary>Equipments:</summary>  
                ${exercise.equipment
                  .map(
                    (eq: string) => `
                  <p>${eq && eq.at(0)?.toUpperCase() + eq.slice(1)}</p>`,
                  )
                  .join("")}
              </details>`
                : ""
            }
            </div>
            <details class="${styles["description"]}" open>
              <summary>Description</summary>
              <p>${exercise.description}</p>
            </details>
            <div class="${styles["exercise-action-container"]}">
              <div class="${styles["exercise-acions"]}">
                ${Button({
                  label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>`,
                  type: "button",
                  btnClass: styles["delete-exercise"],
                  data: `data-exercise-id="${exercise.id}"`,
                })}
                ${Button({
                  label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`,
                  type: "button",
                  btnClass: styles["update-exercise"],
                  data: `data-exercise-id="${exercise.id}"`,
                })}
              </div>
              ${Button({
                label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>`,
                type: "button",
                btnClass: styles["back-to-exercises"],
                data: `data-exercise-id="${exercise.id}"`,
              })}
              
            </div>
        </div>
    </div>
  </div>
  `;
  changeExercisePreview();
  backToPrevoiusPage();
  updateExerciseHandler();
  deleteFunctionHandler();
}

// fetch exercise by id
async function fetchExercise(id: string) {
  try {
    const response = await fetch(`${backendUrl}/api/exercises/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      Notification({
        message: data.error || "Failed to fetch exercise",
        type: "error",
      });
    }
    const data = await response.json();
    return data.exercise;
  } catch (error) {
    console.error("Error fetching exercise:", error);
    Notification({
      message: "An error occurred. Please try again.",
      type: "error",
    });
  }
}

// change preview
function changeExercisePreview() {
  const exercise = document.querySelector(`.${styles["exercise"]}`);
  const imagePreviewBtn = exercise!.querySelector(
    `.${styles["image-preview"]}`,
  ) as HTMLSpanElement;
  const videoPreviewBtn = exercise!.querySelector(
    `.${styles["video-preview"]}`,
  ) as HTMLSpanElement;

  // Preview image

  imagePreviewBtn.addEventListener("click", () => {
    const imageUrl = imagePreviewBtn.dataset.imageUrl;
    const card = imagePreviewBtn.closest(`.${styles["exercise-item"]}`);
    const previewContainer = card?.querySelector(
      `.${styles["exercise-image"]}`,
    ) as HTMLDivElement;

    previewContainer.innerHTML = `<img src="${imageUrl}" alt="exercise">`;

    // scope active state to this card only
    card
      ?.querySelector(`.${styles["video-preview"]}`)
      ?.classList.remove(styles["active-preview-type"]);
    imagePreviewBtn.classList.add(styles["active-preview-type"]);
  });

  // Preview video
  videoPreviewBtn.addEventListener("click", () => {
    const videoUrl = videoPreviewBtn.dataset.videoUrl;
    const card = videoPreviewBtn.closest(`.${styles["exercise-item"]}`);
    const previewContainer = card?.querySelector(
      `.${styles["exercise-image"]}`,
    ) as HTMLDivElement;

    previewContainer.innerHTML = videoUrl
      ? `<video controls autoplay muted src="${videoUrl}"></video>`
      : `<p>Video not available</p>`;

    card
      ?.querySelector(`.${styles["image-preview"]}`)
      ?.classList.remove(styles["active-preview-type"]);
    videoPreviewBtn.classList.add(styles["active-preview-type"]);
  });
}

// go back to exercises
function backToPrevoiusPage() {
  const exercise = document.querySelector(`.${styles["exercise"]}`);
  const exerciseBtn = exercise!.querySelector(
    `.${styles["back-to-exercises"]}`,
  ) as HTMLDivElement;
  exerciseBtn.addEventListener("click", (e: Event) => {
    e.stopPropagation();
    back();
  });
}

// update exercise handler
function updateExerciseHandler() {
  const mainApp = document.getElementById("main-app");
  const updateExerciseBtn = mainApp!.querySelector(
    `.${styles["update-exercise"]}`,
  ) as HTMLButtonElement;

  updateExerciseBtn.addEventListener("click", () => {
    const id = updateExerciseBtn.dataset.exerciseId;
    navigate(`/api/exercises/${id}/update`);
  });
}

// delete function handler
function deleteFunctionHandler() {
  const mainApp = document.getElementById("main-app");

  const deleteExerciseBtn = mainApp!.querySelector(
    `.${styles["delete-exercise"]}`,
  ) as HTMLButtonElement;

  deleteExerciseBtn.addEventListener("click", async () => {
    const id = deleteExerciseBtn.dataset.exerciseId as string;
    await deleteExercise(id);
  });
}

// delete exercise by id
async function deleteExercise(id: string) {
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
      Notification({
        message: data.message || "Exercise deleted successifully",
        type: "success",
        duration: 5000,
      });
      navigate("/api/exercises");
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
