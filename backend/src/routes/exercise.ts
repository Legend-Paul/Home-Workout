import { Router } from "express";
import {
  createExercise,
  getAllExercises,
  getExcrcisesByCategory,
} from "../controllers/exerciseController.js";

const exerciseRouter = Router();

exerciseRouter.get("/", getAllExercises);
exerciseRouter.post("/new", createExercise);
exerciseRouter.get("/:categoryName", getExcrcisesByCategory);

export default exerciseRouter;
