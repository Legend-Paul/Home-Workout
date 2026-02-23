import styles from "./NewExercise.module.css";
import formStyles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Textarea from "../../components/Textarea/Textarea";
import Spinner from "../../components/Spinner/Spinner";
import { type Level } from "../../utils/types";
import Notification from "../../components/Notification/Notification";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const errorSvg = `
      <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg> `;

export default function NewExercise() {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = `
    <div class="${styles["new-exercise-container"]}">
      <div class="${formStyles["auth-form-container"]}">
          <h2>🏋️ Create New Exercise!</h2>
          <p>Back to<a href="/api/exercises"> Exercises</a></p>
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
          placeholder: "Chest Biceps Shoulder",
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
          placeholder: "Bodyweight Dumbells",
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
  const errorMessage = newExerciseContainer!.querySelector(
    `.${styles["res-error-message"]}`,
  ) as HTMLDivElement;

  // Validate form inputs
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

  // Get checked level
  const getCheckedLevel = () =>
    (
      newExerciseContainer!.querySelector(
        "input[name=level]:checked",
      ) as HTMLInputElement
    )?.value;

  // Get checked status
  const getCheckedStatus = () =>
    (
      newExerciseContainer!.querySelector(
        "input[name=status]:checked",
      ) as HTMLInputElement
    )?.value;

  function validateForm(e: Event) {
    const name = nameInput.value.trim();
    const image = imageInput.files && imageInput.files[0];
    // const video = videoInput.files && videoInput.files[0];
    const muscleGroup = muscleGroupInput.value.trim();
    const equipment = equipmentInput.value.trim();
    const description = descriptionInput.value.trim();
    const level = getCheckedLevel() as Level;
    const status = getCheckedStatus();

    // console.log("*************");
    // console.log(
    //   name.length >= 3 &&
    //     muscleGroup.length >= 3 &&
    //     equipment.length >= 3 &&
    //     description &&
    //     image &&
    //     level &&
    //     status,
    // );
    // console.log(name);
    // console.log(muscleGroup);
    // console.log(equipment);
    // console.log(description);
    // console.log(image);
    // console.log(level);
    // console.log(status);

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

  // create new exercise
  newExerciseForm.addEventListener("submit", handleCreateNewExercise);
  async function handleCreateNewExercise(e: Event) {
    e.preventDefault();

    const formdata = new FormData();

    const name = nameInput.value.trim();
    const image = imageInput.files?.[0];
    const video = videoInput.files?.[0];
    const muscleGroup = muscleGroupInput.value.trim().split(" ");
    const equipment = equipmentInput.value.trim().split(" ");
    const description = descriptionInput.value.trim();
    const level = getCheckedLevel() as Level;
    const status = getCheckedStatus() === "Active";

    formdata.append("name", name);
    formdata.append("image", image!); // required, always append
    if (video) formdata.append("video", video); // optional
    muscleGroup.forEach((m) => formdata.append("muscleGroup", m));
    equipment.forEach((eq) => formdata.append("equipment", eq));
    formdata.append("description", description);
    formdata.append("level", level);
    formdata.append("status", String(status));

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "var(--primary-light) !important";
    submitButton.innerHTML = `${Spinner({})}  Creating...`;

    // console.log(formdata.get("name"));
    // console.log(formdata.get("image"));
    // console.log(formdata.get("video"));
    console.log(formdata.get("muscleGroup"));
    console.log(formdata.get("equipment"));
    // console.log(formdata.get("level"));
    // console.log(formdata.get("status"));

    try {
      await createNewExercise(formdata);
    } catch (error) {
      console.error("Error signing up:", error);
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
      body: formdata,
      method: "POST",
    });
    if (response.ok) {
      Notification({
        message: "Exercise created successifully",
        type: "success",
        duration: 5000,
      });
    } else {
      const data = await response.json();
      Notification({
        message: data.error,
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

// Proper form requires starting from a dead hang, engaging the scapula (depressing shoulders), and lifting until the chin clears the bar, focusing on controlled, full-range movement.
