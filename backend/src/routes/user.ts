import { Router } from "express";
import {
  updateUsename,
  updateGoal,
  updateLevel,
} from "../controllers/userController.js";

const userRouter = Router();
userRouter.put("/:id/update/username", updateUsename);
userRouter.put("/:id/update/goal", updateGoal);
userRouter.put("/:id/update/level", updateLevel);

export default userRouter;
