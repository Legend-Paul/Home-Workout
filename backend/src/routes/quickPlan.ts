import { Router } from "express";
import { createNewQuickPlan } from "../controllers/quickStartPlan.js";
import {
  updateQuickWeeklyPlan,
  createQuickWeeklyPlan,
  deleteQuickWeeklyPlan,
  getQuickWeeklyPlan,
} from "../controllers/quickWeeklyPlanController.js";
import {
  createQuickPlanExercise,
  deleteQuickPlanExercise,
  getQuickPlanExercise,
  updateQuickPlanExercise,
} from "../controllers/quickPlanExerciseController.js";

const quickPlanRouter = Router();

// quick plan
quickPlanRouter.post("/new", createNewQuickPlan);

// quick weekly plan
quickPlanRouter.get(":planId/", updateQuickWeeklyPlan);
quickPlanRouter.post("/:planId/new", createQuickWeeklyPlan);
quickPlanRouter.put("/:planId/:id/update", deleteQuickWeeklyPlan);
quickPlanRouter.delete("/:planId/:id/delete", getQuickWeeklyPlan);

// quick weekly plan exercises
quickPlanRouter.get("/:quickStartWeeklyPlanId/exercise", getQuickPlanExercise);
quickPlanRouter.post(
  "/:quickStartWeeklyPlanId/exercise/new",
  createQuickPlanExercise,
);
quickPlanRouter.put(
  "/:quickStartWeeklyPlanId/exercise/:id/update",
  updateQuickPlanExercise,
);
quickPlanRouter.delete(
  "/:quickStartWeeklyPlanId/exercise/:id/delete",
  deleteQuickPlanExercise,
);

export default quickPlanRouter;
