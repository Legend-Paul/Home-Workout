import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
} from "../controllers/workoutController.js";

const workoutRouter = Router();

workoutRouter.post("/new", createWorkout);
workoutRouter.get("/", getAllWorkouts);

export default workoutRouter;
