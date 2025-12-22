import { Router } from "express";
import {
  createWeeklyPlan,
  getWeeklyPlan,
  updateWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/", getWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);

export default weeklyPlanRouter;
