import { Router } from "express";
import {
  updateUsename,
  updateGoal,
  updateLevel,
  createUserQuickPlan,
  getAllUsers,
} from "../controllers/userController.js";
import {
  sendNewFriendship,
  acceptNewFriendship,
  getFriends,
  deleteFriendship,
} from "../controllers/friendshipController.js";
import {
  createNewCalendarEntry,
  getCalendarEntry,
} from "../controllers/calendarEntry.js";
import {
  createUserPlan,
  getUserPlansHandler,
  updateUserPlan,
  deleteUserPlanHandler,
} from "../controllers/usePlan.js";
import { createQuickPlanUser } from "../controllers/quickPlanUser.js";

const userRouter = Router();

// user custom plan
userRouter.post("/user-plan/new", createUserPlan);
userRouter.get("/user-plans", getUserPlansHandler);
userRouter.put("/user-plans/:id/update", updateUserPlan);
userRouter.delete("/user-plans/:id/update", deleteUserPlanHandler);

// quick plan users
userRouter.get("/:id/quick-plan", createUserQuickPlan);
userRouter.get("/quick-plan/new", createQuickPlanUser);

// user
userRouter.get("/all", getAllUsers);
userRouter.put("/:id/update/username", updateUsename);
userRouter.put("/:id/update/goal", updateGoal);
userRouter.put("/:id/update/level", updateLevel);

// calendar entry
userRouter.post("/:id/calendar-entry", getCalendarEntry);
userRouter.post("/:id/calendar-entry/new", createNewCalendarEntry);

// friends
userRouter.get("/:id/friendship", getFriends);
userRouter.post("/:id/friendship/new", sendNewFriendship);
userRouter.post("/:id/friendship/accept", acceptNewFriendship);
userRouter.delete("/:id/friendship/delete", deleteFriendship);

export default userRouter;
