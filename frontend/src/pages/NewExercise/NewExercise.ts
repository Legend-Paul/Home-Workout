import styles from "./NewExercise.module.css";
import formStyles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

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
        <div class="${styles["exercise-radio-container"]} ${styles["exercise-level-container"]}">
          <h3 class="${styles["level-heading"]}">Select exercise level</h3>
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
        <div class="${styles["exercise-status-container"]} ${styles["exercise-radio-container"]}">
          <h3 class="${styles["status-heading"]}">Select Exercise Status</h3>
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
          type: "submit",
        })}

    </form>
    `;
}
