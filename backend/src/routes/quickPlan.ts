import { Router } from "express";
import {
  createQuickPlan,
  updateQuickPlan,
  deleteQuickPlan,
  getAllQuickPlans,
} from "../controllers/quickPlanController.js";
import {
  createQuickPlanExercise,
  deleteQuickPlanExercise,
  getQuickPlanExercise,
  updateQuickPlanExercise,
} from "../controllers/quickPlanExerciseController.js";

const quickPlanRouter = Router();

quickPlanRouter.get("/", getAllQuickPlans);
quickPlanRouter.post("/new", createQuickPlan);
quickPlanRouter.put("/:id/update", updateQuickPlan);
quickPlanRouter.delete("/:id/delete", deleteQuickPlan);

// quick plan exercises
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
