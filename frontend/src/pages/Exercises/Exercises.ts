import styles from "./Exercises.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export default async function Exercises() {
  const mainApp = document.getElementById("main-app");
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
                      label: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
