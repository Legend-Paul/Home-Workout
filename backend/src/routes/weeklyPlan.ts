import { Router } from "express";
import { createWeeklyPlan } from "../controllers/weeklyPlanController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.post("/new", createWeeklyPlan);

export default weeklyPlanRouter;
