import { Router } from "express";
import { createWorkout } from "../controllers/workoutController.js";

const workoutRouter = Router();

workoutRouter.post("/new", createWorkout);

export default workoutRouter;
