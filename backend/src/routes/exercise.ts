import { Router } from "express";
import {
  createExercise,
  getAllExercises,
} from "../controllers/exerciseController.js";

const exerciseRouter = Router();

exerciseRouter.get("/", getAllExercises);
exerciseRouter.post("/new", createExercise);

export default exerciseRouter;
