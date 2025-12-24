import { Router } from "express";
import {
  updateUsename,
  updateGoal,
  updateLevel,
  createUserQuickPlan,
} from "../controllers/userController.js";
import { sendNewFriendship } from "../controllers/friendshipController.js";

const userRouter = Router();
userRouter.get("/:id/quick-plan", createUserQuickPlan);
userRouter.put("/:id/update/username", updateUsename);
userRouter.put("/:id/update/goal", updateGoal);
userRouter.put("/:id/update/level", updateLevel);

// friends
userRouter.post("/:id/friendship/new", sendNewFriendship);
userRouter.post("/:id/friendship/accept", sendNewFriendship);

export default userRouter;
