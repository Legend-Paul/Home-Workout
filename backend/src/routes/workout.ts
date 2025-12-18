import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  createWorkoutExercises,
  getWorkoutByName,
} from "../controllers/workoutController.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);
workoutRouter.get("/:name", getWorkoutByName);
workoutRouter.post("/:name/new", createWorkoutExercises);

export default workoutRouter;
