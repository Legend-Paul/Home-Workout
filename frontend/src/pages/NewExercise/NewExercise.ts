import styles from "./NewExercise.module.css";
import formStyles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Textarea from "../../components/Textarea/Textarea";
import Spinner from "../../components/Spinner/Spinner";
import { type Level } from "../../utils/types";
import Notification from "../../components/Notification/Notification";
import { back, navigate } from "../../router";
import Header from "../../components/Header/Header";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = localStorage.getItem("Authorization") || "";

export default async function NewExercise() {
  const mainApp = document.getElementById("main-app");
  await Header();
  mainApp!.innerHTML = `
    <div class="${styles["new-exercise-container"]}">
      <div class="${formStyles["auth-form-container"]}">
          <h2>🏋️ Create New Exercise!</h2>
          ${Button({
            label: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg> <span>Back</span>`,
            type: "button",
            btnClass: styles["back-btn"],
          })}
      </div>
      <div class="${formStyles["res-error-message"]}"></div>
      <form id="${formStyles["auth-form"]}" enctype="multipart/form-data" method="POST">
        ${Input({
          label: "Name",
          id: "name",
          type: "input",
          placeholder: "e.g Pushup",
          name: "name",
          required: true,
          minLength: 3,
          errorMessage: "Name must be at least 3 characters",
        })}
        <div class="${styles["exercise-media"]}">
          ${Input({
            label: "Image",
            id: "image",
            type: "file",
            placeholder: "Max 50Mb",
            name: "image",
            required: true,
            minLength: 3,
            errorMessage: "Image is greater than 50Mb",
            accept: "image/*",
          })}
          ${Input({
            label: "Video (optional)",
            id: "video",
            type: "file",
            placeholder: "Max 50Mb",
            name: "video",
            required: false,
            minLength: 3,
            errorMessage: "Video is greater than 50Mb",
            accept: "video/*",
          })}
        </div>
        ${Input({
          label: "Muscle groups",
          id: "muscle-group",
          type: "input",
          placeholder: "Chest, Biceps ,Shoulder",
          name: "muscleGroup",
          required: true,
          minLength: 3,
          errorMessage:
            "Muscle group should contain at least one muscle of at least 3 characters",
        })}
        ${Input({
          label: "Equipments",
          id: "equipment",
          type: "input",
          placeholder: "Bodyweight, Dumbells",
          name: "equipment",
          minLength: 3,
          errorMessage:
            "Equipments group should contain at least one equipments of at least 3 characters",
        })}
         ${Textarea({
           label: "Desciption",
           id: "description",
           name: "description",
           required: true,
           placeholder: "Enter decription",
           minLength: 3,
           errorMessage: "Description should contain at least 3 characters",
         })}
        <div class="${styles["exercise-radio-container"]} ${styles["exercise-level-container"]}">
          <h3>Select exercise level</h3>
          <div class="${styles["exercise-radio"]}">
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
              value: "INTERMIDIATE",
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
        <div class="${styles["exercise-status-container"]} ${styles["exercise-radio-container"]}">
          <h3>Select Exercise Status</h3>
          <div class="${styles["exercise-radio"]}">
            ${Input({
              label: "Active",
              id: "active",
              type: "radio",
              placeholder: "",
              name: "status",
              required: true,
              minLength: 3,
              errorMessage: "",
              checked: true,
              value: "Active",
            })}
            ${Input({
              label: "Inactive",
              id: "inactive",
              type: "radio",
              placeholder: "",
              name: "status",
              required: true,
              minLength: 3,
              errorMessage: "",
              checked: false,
              value: "Inactive",
            })}
          </div>
        </div>
        ${Button({
          label: "Create New Exercise",
          type: "submit",
          btnClass: styles["create-exercise"],
        })}

    </form>
    `;
  const newExerciseContainer = mainApp!.querySelector(
    `.${styles["new-exercise-container"]}`,
  ) as HTMLDivElement;
  const newExerciseForm = newExerciseContainer!.querySelector(
    `#${formStyles["auth-form"]}`,
  ) as HTMLFormElement;
  const nameInput = newExerciseContainer!.querySelector(
    "#name",
  ) as HTMLInputElement;
  const imageInput = newExerciseContainer!.querySelector(
    "#image",
  ) as HTMLInputElement;
  const videoInput = newExerciseContainer!.querySelector(
    "#video",
  ) as HTMLInputElement;
  const muscleGroupInput = newExerciseContainer!.querySelector(
    "#muscle-group",
  ) as HTMLInputElement;
  const equipmentInput = newExerciseContainer!.querySelector(
    "#equipment",
  ) as HTMLInputElement;
  const descriptionInput = newExerciseContainer!.querySelector(
    "#description",
  ) as HTMLTextAreaElement;
  const submitButton = newExerciseContainer!.querySelector(
    `.${styles["create-exercise"]}`,
  ) as HTMLButtonElement;
  const backBtn = document.querySelector(
    `.${styles["back-btn"]}`,
  ) as HTMLButtonElement;

  nameInput.addEventListener("input", validateForm);
  imageInput.addEventListener("input", validateForm);
  videoInput.addEventListener("input", validateForm);
  muscleGroupInput.addEventListener("input", validateForm);
  equipmentInput.addEventListener("input", validateForm);
  newExerciseContainer!
    .querySelectorAll("input[name=level]")
    .forEach((el) => el.addEventListener("change", validateForm));
  newExerciseContainer!
    .querySelectorAll("input[name=status]")
    .forEach((el) => el.addEventListener("change", validateForm));

  backBtn.addEventListener("click", back);

  const getCheckedLevel = () =>
    (
      newExerciseContainer!.querySelector(
        "input[name=level]:checked",
      ) as HTMLInputElement
    )?.value;

  const getCheckedStatus = () =>
    (
      newExerciseContainer!.querySelector(
        "input[name=status]:checked",
      ) as HTMLInputElement
    )?.value;

  function validateForm() {
    const name = nameInput.value.trim();
    const image = imageInput.files && imageInput.files[0];

    const muscleGroup = muscleGroupInput.value.trim();
    const equipment = equipmentInput.value.trim();
    const description = descriptionInput.value.trim();
    const level = getCheckedLevel() as Level;
    const status = getCheckedStatus();

    if (
      name.length >= 3 &&
      muscleGroup.length >= 3 &&
      equipment.length >= 3 &&
      description &&
      image &&
      level &&
      status
    ) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark)";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "var(--primary-light)";
    }
  }

  newExerciseForm.addEventListener("submit", handleCreateNewExercise);
  async function handleCreateNewExercise(e: Event) {
    e.preventDefault();

    const formdata = new FormData();

    const name = nameInput.value.trim();
    const image = imageInput.files?.[0];
    const video = videoInput.files?.[0];
    const muscleGroup = muscleGroupInput.value.trim().split(",");
    const equipment = equipmentInput.value.trim().split(",");
    const description = descriptionInput.value.trim();
    const level = getCheckedLevel() as Level;
    const status = getCheckedStatus() === "Active";

    formdata.append("name", name);
    formdata.append("image", image!);
    if (video) formdata.append("video", video);
    muscleGroup.forEach((m) => formdata.append("muscleGroup", m.toLowerCase()));
    equipment.forEach((eq) => formdata.append("equipment", eq.toLowerCase()));
    formdata.append("description", description);
    formdata.append("level", level);
    formdata.append("status", String(status));

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "var(--primary-light) !important";
    submitButton.innerHTML = `${Spinner({})}  Creating...`;

    try {
      await createNewExercise(formdata);
    } catch (error) {
      console.error("Error Creating exrecise:", error);
      Notification({
        message: "An error occurred. Please try again",
        type: "error",
        duration: 5000,
      });
    } finally {
      submitButton.innerHTML = "Create New Exercise";
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    }
  }
}

async function createNewExercise(formdata: FormData) {
  try {
    const response = await fetch(`${backendUrl}/api/exercises/new`, {
      headers: { Authorization: token },
      body: formdata,
      method: "POST",
    });
    if (response.ok) {
      Notification({
        message: "Exercise created successifully",
        type: "success",
        duration: 5000,
      });
      navigate("/exercises");
    } else {
      const data = await response.json();
      Notification({
        message: data.error || "Failed to create exercise",
        type: "error",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    Notification({
      message: "An error occurred. Please try again",
      type: "error",
      duration: 5000,
    });
  }
}
