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
quickPlanRouter.get("/:planId/exercise", getQuickPlanExercise);
quickPlanRouter.post("/:planId/exercise/new", createQuickPlanExercise);
quickPlanRouter.put("/:planId/exercise/:id/update", updateQuickPlanExercise);
quickPlanRouter.delete("/:planId/exercise/:id/delete", deleteQuickPlanExercise);

export default quickPlanRouter;
