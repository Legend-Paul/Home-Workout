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
  updateWeekDayExercises,
  deleteWeekDayExercises,
} from "../controllers/weekDayExerciseController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/", getAllWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);
weeklyPlanRouter.delete("/:id/delete", deleteWeeklyPlan);

// exercise
weeklyPlanRouter.get("/:planId/exercise", getWeekDayExercises);
weeklyPlanRouter.post("/:planId/exercise/new", createWeekDayExercises);
weeklyPlanRouter.put("/:planId/exercise/:id/update", updateWeekDayExercises);
weeklyPlanRouter.delete("/:planId/exercise/:id/delete", deleteWeekDayExercises);

export default weeklyPlanRouter;
