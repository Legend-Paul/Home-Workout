import { Router } from "express";
import { createQuickPlan } from "../controllers/quickPlanController.js";
import { createQuickPlanExercise } from "../controllers/quickPlanExercise.js";

const quickPlanRouter = Router();

quickPlanRouter.post("/new", createQuickPlan);
quickPlanRouter.post("/:id/exercise/new", createQuickPlanExercise);

export default quickPlanRouter;
