import styles from "./NewExercise.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export default function NewExercise() {
  const mainApp = document.getElementById("main-app");

  mainApp!.innerHTML = `
    <div class="${styles["new-exercise-container"]}">
    <form id="uploadForm" enctype="multipart/form-data">
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

      ${Input({
        label: "Image",
        id: "image",
        type: "file",
        placeholder: "Max 50Mb",
        name: "image",
        required: true,
        minLength: 3,
        errorMessage: "Image is greater than 50Mb",
      })}
      ${Input({
        label: "Video",
        id: "video",
        type: "file",
        placeholder: "Max 50Mb",
        name: "video",
        required: true,
        minLength: 3,
        errorMessage: "Video is greater than 50Mb",
      })}
      ${Input({
        label: "Muscle group",
        id: "muscle-group",
        type: "input",
        placeholder: "Chest Biceps Shoulder",
        name: "muscleGroup",
        required: true,
        minLength: 3,
        errorMessage: "Muscle group should contain one muscle",
      })}
      ${Input({
        label: "Equipment",
        id: "equipment",
        type: "input",
        placeholder: "Bodyweight Dumbells",
        name: "equipment",
        minLength: 3,
        errorMessage: "Equipment is greater than 50Mb",
      })}
      <div class="exercise-level-container">
        <h3 class="${styles["level-heading"]}">Select exercise level</h3>
        <div class="exercise-level">
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
          })}
        </div>
      </div>
      <div class="${styles["exercise-status-container"]}">
        <h3 class="${styles["status-heading"]}">Select Exercise Status</h3>
        <div class="${styles["exercise-status"]}">
          ${Input({
            label: "Active",
            id: "active",
            type: "radio",
            placeholder: "",
            name: "status",
            required: true,
            minLength: 3,
            errorMessage: "",
            checked: false,
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
          })}
        </div>
      </div>
      ${Button({
        label: "Create Exercise",
        disabled: true,
      })}

    </form>
    `;
}
