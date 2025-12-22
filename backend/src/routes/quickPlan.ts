import { Router } from "express";
import {
  createQuickPlan,
  getQuickPlanExercise,
  updateQuickPlan,
} from "../controllers/quickPlanController.js";
import { createQuickPlanExercise } from "../controllers/quickPlanExerciseController.js";

const quickPlanRouter = Router();

quickPlanRouter.post("/new", createQuickPlan);
quickPlanRouter.put("/:id", updateQuickPlan);
quickPlanRouter.get("/:id/exercise", getQuickPlanExercise);
quickPlanRouter.post("/:id/exercise/new", createQuickPlanExercise);

export default quickPlanRouter;
