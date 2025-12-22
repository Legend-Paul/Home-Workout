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
quickPlanRouter.put("/:id", deleteQuickPlan);
quickPlanRouter.delete("/:id", updateQuickPlan);

// quick plan exercises
quickPlanRouter.get("/:planId/exercise", getQuickPlanExercise);
quickPlanRouter.post("/:planId/exercise/new", createQuickPlanExercise);
quickPlanRouter.put("/:planId/exercise/:id", updateQuickPlanExercise);
quickPlanRouter.delete("/:planId/exercise/:id", deleteQuickPlanExercise);

export default quickPlanRouter;
