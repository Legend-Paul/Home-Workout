import { Router } from "express";
import { createQuickStartPlan } from "../controllers/quickStartPlanController.js";

const quickStartPlanRouter = Router();

quickStartPlanRouter.post("/new", createQuickStartPlan);

export default quickStartPlanRouter;
