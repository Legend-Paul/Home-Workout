import { Router } from "express";
import {
  createQuickPlan,
  getQuickPlanExercise,
  updateQuickPlan,
  deleteQuickPlan,
} from "../controllers/quickPlanController.js";
import { createQuickPlanExercise } from "../controllers/quickPlanExerciseController.js";

const quickPlanRouter = Router();

quickPlanRouter.post("/new", createQuickPlan);
quickPlanRouter.put("/:id", deleteQuickPlan);
quickPlanRouter.delete("/:id", updateQuickPlan);
quickPlanRouter.get("/:id/exercise", getQuickPlanExercise);
quickPlanRouter.post("/:id/exercise/new", createQuickPlanExercise);

export default quickPlanRouter;
