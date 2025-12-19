import { Router } from "express";
import {
  createUserWorkout,
  getUserWorkout,
  deleteUserWorkout,
} from "../controllers/userWorkoutController.js";

const userWorkoutRouter = Router();

userWorkoutRouter.get("/:id", getUserWorkout);
userWorkoutRouter.post("/:id/new", createUserWorkout);
userWorkoutRouter.delete("/:id", deleteUserWorkout);
// userWorkoutRouter.put("/:id", updateUserWorkout);

export default userWorkoutRouter;
