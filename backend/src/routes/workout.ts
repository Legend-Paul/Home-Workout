import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
} from "../controllers/workoutController.js";
import {
  createWorkoutExercises,
  getWorkoutExercises,
} from "../controllers/workoutExercise.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);
workoutRouter.get("/:name", getWorkoutExercises);
// workoutRouter.post("/:name/exercise/new", createWorkoutExercises);
workoutRouter.post("/:name/new", createWorkoutExercises);

export default workoutRouter;
