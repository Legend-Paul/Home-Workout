import { Router } from "express";
import {
  createQuickPlan,
  getQuickPlanExercise,
} from "../controllers/quickPlanController.js";
import { createQuickPlanExercise } from "../controllers/quickPlanExerciseController.js";

const quickPlanRouter = Router();

quickPlanRouter.post("/new", createQuickPlan);
quickPlanRouter.post("/:id/exercise", getQuickPlanExercise);
quickPlanRouter.post("/:id/exercise/new", createQuickPlanExercise);

export default quickPlanRouter;
