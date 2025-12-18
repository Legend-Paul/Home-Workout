import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  deleteWorkout,
  updateWorkout,
} from "../controllers/workoutController.js";
import {
  addWorkoutExercises,
  getWorkoutExercises,
} from "../controllers/workoutExerciseController.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);
workoutRouter.get("/:id", getWorkoutExercises);
workoutRouter.put("/:id", updateWorkout);
workoutRouter.delete("/:id", deleteWorkout);
// workoutRouter.post("/:name/exercise/new", createWorkoutExercises);
workoutRouter.post("/:id/exercise/add", addWorkoutExercises);

export default workoutRouter;
