import { Router } from "express";
import { createQuickPlan } from "../controllers/quickPlanController.js";

const quickPlanRouter = Router();

quickPlanRouter.post("/new", createQuickPlan);

export default quickPlanRouter;
