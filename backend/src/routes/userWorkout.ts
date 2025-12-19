import { Router } from "express";
import { createWorkoutController } from "../controllers/userWorkoutController.js";

const userWorkoutRouter = Router();

userWorkoutRouter.get("/", createWorkoutController);

export default userWorkoutRouter;
