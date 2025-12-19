import { Router } from "express";
import { createWorkout } from "../controllers/userWorkoutController.js";

const userWorkoutRouter = Router();

userWorkoutRouter.get("/", createWorkout);

export default userWorkoutRouter;
