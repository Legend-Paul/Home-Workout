import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
} from "../controllers/workoutController.js";

const workoutRouter = Router();

workoutRouter.get("/", getAllWorkouts);
workoutRouter.post("/new", createWorkout);

export default workoutRouter;
