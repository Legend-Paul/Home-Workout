import { Router } from "express";
import {
  createWeeklyPlan,
  getWeeklyPlans,
  updateWeeklyPlan,
  deleteWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

import {
  createWeeklyPlanExercise,
  getWeeklyPlanExercises,
  updateWeeklyPlanExercise,
  deleteWeeklyPlanExercise,
} from "../controllers/weekPlanExerciseController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/:userPlanId", getWeeklyPlans);
weeklyPlanRouter.post("/:userPlanId/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);
weeklyPlanRouter.delete("/:id/delete", deleteWeeklyPlan);

// exercise
weeklyPlanRouter.get("/:weeklyPlanId/exercise", getWeeklyPlanExercises);
weeklyPlanRouter.post("/:weeklyPlanId/exercise/new", createWeeklyPlanExercise);
weeklyPlanRouter.put(
  "/:weeklyPlanId/exercise/:id/update",
  updateWeeklyPlanExercise,
);
weeklyPlanRouter.delete(
  "/:weeklyPlanId/exercise/:id/delete",
  deleteWeeklyPlanExercise,
);

export default weeklyPlanRouter;
