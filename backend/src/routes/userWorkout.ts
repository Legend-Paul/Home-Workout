import { Router } from "express";
import {
  createWorkout,
  getUserWorkout,
} from "../controllers/userWorkoutController.js";

const userWorkoutRouter = Router();

userWorkoutRouter.get("/", createWorkout);
userWorkoutRouter.get("/:id", getUserWorkout);

export default userWorkoutRouter;
