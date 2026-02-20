import styles from "./Exercises.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export default async function Exercises() {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = `
   <div class="${styles["exercises-container"]}">
        <div class="${styles["exercise-filter"]}">
            <h2>Filter Exercises</h2>
            <div class="${styles["filter-group"]}">
                <div class="${styles["filter-group"]}">
                <form id="search-form">
                    ${Input({
                      id: "search",
                      name: "search",
                      placeholder: "Search exercises...",
                      label: "Search:",
                    })}
                    ${Button({
                      label: "Search",
                      type: "submit",
                    })}
            </div>
                <label for="muscle-group">Muscle Group:</label>
                <select id="muscle-group">
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
                <select id="equipment">
                    <option value="">All</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="barbell">Barbell</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="machine">Machine</option>
                </select>
            </div>
            <div class="${styles["filter-group"]}">
                <label for="difficulty">Difficulty:</label>
                <select id="difficulty">
                    <option value="">All</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
            <div class="${styles["filter-group"]}">
                <label for="exercise-status">Exercise status:</label>
                <select id="exercise-status">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <div class="${styles["filter-actions"]}">
                ${Button({
                  label: "Apply Filters",
                  type: "button",
                })}
                ${Button({
                  label: "Reset Filters",
                  type: "button",
                })}
            </div>
        </div>
        <div class="${styles["exercise-list"]}">
                <div class="${styles["exercise-item"]}">
                    <div class="${styles["exercise-image"]}">
                        <img src="https://via.placeholder.com/150" alt="Push-up">
                    </div>
                    <h3>Push-up</h3>
                    <p>Muscle Group: Chest</p>
                    <p>Equipment: Bodyweight</p>
                    <p>Difficulty: Beginner</p>
                    <div class="${styles["exercise-acions"]}">
                        ${Button({
                          label: "Edit",
                          type: "button",
                        })}
                        ${Button({
                          label: "Delete",
                          type: "button",
                        })}
                    </div>
                </div>
                <div class="${styles["exercise-item"]}">
                    <div class="${styles["exercise-image"]}">
                        <img src="https://via.placeholder.com/150" alt="Squat">
                    </div>
                    <h3>Squat</h3>
                    <p>Muscle Group: Legs</p>
                    <p>Equipment: Bodyweight</p>
                    <p>Difficulty: Beginner</p>
                </div>
        
        </div>
    </div>
  `;
}
