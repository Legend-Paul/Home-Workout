import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  deleteWorkout,
  updateWorkout,
} from "../controllers/workoutController.js";
import {
  createWorkoutExercises,
  getWorkoutExercises,
} from "../controllers/workoutExerciseController.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);
workoutRouter.get("/:name", getWorkoutExercises);
workoutRouter.delete("/:id", deleteWorkout);
workoutRouter.put("/:id", updateWorkout);
// workoutRouter.post("/:name/exercise/new", createWorkoutExercises);
workoutRouter.post("/:name/new", createWorkoutExercises);

export default workoutRouter;
