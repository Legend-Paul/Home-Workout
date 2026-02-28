import { Router } from "express";
import { createNewQuickPlan } from "../controllers/quickStartPlan.js";
import requireAdmin from "../middleware/requireAuth.js";
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
quickPlanRouter.post("/new", requireAdmin, createNewQuickPlan);

// quick weekly plan
quickPlanRouter.get(":planId/", updateQuickWeeklyPlan);
quickPlanRouter.post("/:planId/new", requireAdmin, createQuickWeeklyPlan);
quickPlanRouter.put("/:planId/:id/update", requireAdmin, deleteQuickWeeklyPlan);
quickPlanRouter.delete("/:planId/:id/delete", requireAdmin, getQuickWeeklyPlan);

// quick weekly plan exercises
quickPlanRouter.get("/:quickStartWeeklyPlanId/exercise", getQuickPlanExercise);
quickPlanRouter.post(
  "/:quickStartWeeklyPlanId/exercise/new",
  requireAdmin,
  createQuickPlanExercise,
);
quickPlanRouter.put(
  "/:quickStartWeeklyPlanId/exercise/:id/update",
  requireAdmin,
  updateQuickPlanExercise,
);
quickPlanRouter.delete(
  "/:quickStartWeeklyPlanId/exercise/:id/delete",
  requireAdmin,
  deleteQuickPlanExercise,
);

export default quickPlanRouter;
