import { Router } from "express";
import {
  createWeeklyPlan,
  getAllWeeklyPlan,
  updateWeeklyPlan,
  deleteWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

import {
  createWeekDayExercises,
  getWeekDayExercises,
} from "../controllers/weekDayExerciseController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/", getAllWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);
weeklyPlanRouter.delete("/:id/delete", deleteWeeklyPlan);

// exercise
weeklyPlanRouter.post("/:planId/exercise/new", createWeekDayExercises);
weeklyPlanRouter.get("/:planId/exercise", getWeekDayExercises);

export default weeklyPlanRouter;
