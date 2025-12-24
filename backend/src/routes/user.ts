import { Router } from "express";
import {
  updateUsename,
  updateGoal,
  updateLevel,
  createUserQuickPlan,
} from "../controllers/userController.js";
import {
  sendNewFriendship,
  acceptNewFriendship,
  getFriends,
  deleteFriendship,
} from "../controllers/friendshipController.js";

const userRouter = Router();
userRouter.get("/:id/quick-plan", createUserQuickPlan);
userRouter.put("/:id/update/username", updateUsename);
userRouter.put("/:id/update/goal", updateGoal);
userRouter.put("/:id/update/level", updateLevel);

// friends
userRouter.get("/:id/friendship", getFriends);
userRouter.post("/:id/friendship/new", sendNewFriendship);
userRouter.post("/:id/friendship/accept", acceptNewFriendship);
userRouter.delete("/:id/friendship/delete", deleteFriendship);

export default userRouter;
