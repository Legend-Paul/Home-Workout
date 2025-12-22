import { Router } from "express";
import {
  createWeeklyPlan,
  getWeeklyPlan,
  updateWeeklyPlan,
  deleteWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/", getWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);
weeklyPlanRouter.delete("/:id/delete", deleteWeeklyPlan);

export default weeklyPlanRouter;
