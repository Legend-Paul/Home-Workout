import { Router } from "express";
import {
  updateUsename,
  updateGoal,
  updateLevel,
  createUserQuickPlan,
} from "../controllers/userController.js";

const userRouter = Router();
userRouter.get("/:id/quick-plan", createUserQuickPlan);
userRouter.put("/:id/update/username", updateUsename);
userRouter.put("/:id/update/goal", updateGoal);
userRouter.put("/:id/update/level", updateLevel);

export default userRouter;
