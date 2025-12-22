import { Router } from "express";
import {
  createWeeklyPlan,
  getAllWeeklyPlan,
  updateWeeklyPlan,
  deleteWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/", getAllWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);
weeklyPlanRouter.delete("/:id/delete", deleteWeeklyPlan);

// exercise

export default weeklyPlanRouter;
