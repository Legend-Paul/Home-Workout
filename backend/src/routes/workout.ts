import { Router } from "express";
import { createWorkout } from "../controllers/workoutController.js";

const workoutRouter = Router();

workoutRouter.post("/create", createWorkout);

export default workoutRouter;
