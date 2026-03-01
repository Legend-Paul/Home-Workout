import { Router } from "express";
import { updateUser, getAllUsers } from "../controllers/userController.js";
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
  getUserPlans,
  updateUserPlan,
  deleteUserPlan,
} from "../controllers/userPlan.js";
import {
  createQuickPlanUser,
  getQuickPlanUsers,
  updateQuickPlanUser,
  deleteQuickPlanUserHandler,
} from "../controllers/quickPlanUser.js";

const userRouter = Router();

// user custom plan
userRouter.post("/user-plan/new", createUserPlan);
userRouter.get("/user-plans", getUserPlans);
userRouter.put("/user-plans/:id/update", updateUserPlan);
userRouter.delete("/user-plans/:id/update", deleteUserPlan);

// quick plan users
// userRouter.get("/:id/quick-plan", createUserQuickPlan);
userRouter.get("/quick-plan", getQuickPlanUsers);
userRouter.post("/quick-plan/new", createQuickPlanUser);
userRouter.put("/quick-plan/:id/update", updateQuickPlanUser);
userRouter.delete("/quick-plan/:id/delete", deleteQuickPlanUserHandler);

// user
userRouter.get("/all", getAllUsers);
userRouter.put("/:id/update", updateUser);

// calendar entry
userRouter.post("/:id/calendar-entry", getCalendarEntry);
userRouter.post("/:id/calendar-entry/new", createNewCalendarEntry);

// friends
userRouter.get("/:id/friendship", getFriends);
userRouter.post("/:id/friendship/new", sendNewFriendship);
userRouter.post("/:id/friendship/accept", acceptNewFriendship);
userRouter.delete("/:id/friendship/delete", deleteFriendship);

export default userRouter;
