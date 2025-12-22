import { Router } from "express";
import {
  createWeeklyPlan,
  getWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.post("/", getWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);

export default weeklyPlanRouter;
