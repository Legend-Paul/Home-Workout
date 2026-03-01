import { Router } from "express";
import {
  createWeeklyPlan,
  getAllWeeklyPlan,
  updateWeeklyPlan,
  deleteWeeklyPlan,
} from "../controllers/weeklyPlanController.js";

import {
  createWeeklyPlanExercise,
  getWeeklyPlanExercises,
  updateWeeklyPlanExercise,
  deleteWeekDayExercises,
} from "../controllers/weekDayExerciseController.js";

const weeklyPlanRouter = Router();

weeklyPlanRouter.get("/", getAllWeeklyPlan);
weeklyPlanRouter.post("/new", createWeeklyPlan);
weeklyPlanRouter.put("/:id/update", updateWeeklyPlan);
weeklyPlanRouter.delete("/:id/delete", deleteWeeklyPlan);

// exercise
weeklyPlanRouter.get("/:weeklyPlanId/exercise", getWeeklyPlanExercises);
weeklyPlanRouter.post("/:weeklyPlanId/exercise/new", createWeeklyPlanExercise);
weeklyPlanRouter.put(
  "/:weeklyPlanId/exercise/:id/update",
  updateWeeklyPlanExercise,
);
weeklyPlanRouter.delete(
  "/:weeklyPlanId/exercise/:id/delete",
  deleteWeekDayExercises,
);

export default weeklyPlanRouter;
