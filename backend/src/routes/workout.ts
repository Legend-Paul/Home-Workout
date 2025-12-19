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
  deleteWorkoutExercises,
} from "../controllers/workoutExerciseController.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);
workoutRouter.get("/:id", getWorkoutExercises);
workoutRouter.put("/:id", updateWorkout);
workoutRouter.delete("/:id", deleteWorkout);
workoutRouter.post("/:id/new", addWorkoutExercises);
workoutRouter.delete("/:id/remove", deleteWorkoutExercises);

export default workoutRouter;
