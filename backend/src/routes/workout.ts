import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  createWourkoutExercises,
} from "../controllers/workoutController.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);
workoutRouter.get("/:name/new", createWourkoutExercises);

export default workoutRouter;
