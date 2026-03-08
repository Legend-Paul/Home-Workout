import { Router } from "express";
import {
  createNewQuickPlan,
  getAllQuickPlans,
  deleteQuickPlanHandler,
  updateQuickPlan,
} from "../controllers/quickStartPlan.js";
import requireAdmin from "../middleware/requireAuth.js";
import {
  updateQuickWeeklyPlan,
  createQuickWeeklyPlan,
  deleteQuickWeeklyPlan,
  getQuickWeeklyPlan,
  quickWeeklyPlanById,
} from "../controllers/quickWeeklyPlanController.js";
import {
  createQuickPlanExercise,
  deleteQuickPlanExercise,
  getQuickPlanExercise,
  updateQuickPlanExercise,
} from "../controllers/quickPlanExerciseController.js";

const quickPlanRouter = Router();

// quick plan
quickPlanRouter.get("/", getAllQuickPlans);
quickPlanRouter.post("/new", requireAdmin, createNewQuickPlan);
quickPlanRouter.put("/:id/update", requireAdmin, updateQuickPlan);
quickPlanRouter.delete("/:id/delete", requireAdmin, deleteQuickPlanHandler);

// quick weekly plan
quickPlanRouter.get(":planId/weekly-plans", getQuickWeeklyPlan);
quickPlanRouter.post(
  "/:planId/weekly-plans/new",
  requireAdmin,
  createQuickWeeklyPlan,
);
quickPlanRouter.get("/:planId/weekly-plans/:id", quickWeeklyPlanById);
quickPlanRouter.put(
  "/:planId/weekly-plans/:id/update",
  requireAdmin,
  updateQuickWeeklyPlan,
);
quickPlanRouter.delete(
  "/:planId/:id/delete",
  requireAdmin,
  deleteQuickWeeklyPlan,
);

// quick weekly plan exercises
quickPlanRouter.get(
  "/:planId/weekly-plans/:weeklyPlanId/exercises",
  getQuickPlanExercise,
);
quickPlanRouter.post(
  "/:quickStartWeeklyPlanId/exercises/new",
  requireAdmin,
  createQuickPlanExercise,
);
quickPlanRouter.put(
  "/:planId/weekly-plans/:weeklyPlanId/exercises/:id/update",
  requireAdmin,
  updateQuickPlanExercise,
);
quickPlanRouter.delete(
  "/:planId/weekly-plans/:weeklyPlanId/exercises/:id/delete",
  requireAdmin,
  deleteQuickPlanExercise,
);

export default quickPlanRouter;
