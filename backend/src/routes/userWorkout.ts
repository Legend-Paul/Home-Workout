import { Router } from "express";
import {
  createUserWorkout,
  getUserWorkout,
  deleteUserWorkout,
} from "../controllers/userWorkoutController.js";

const userWorkoutRouter = Router();

userWorkoutRouter.post("/new", createUserWorkout);
userWorkoutRouter.get("/user/:id", getUserWorkout);
userWorkoutRouter.delete("/:id", deleteUserWorkout);

export default userWorkoutRouter;
