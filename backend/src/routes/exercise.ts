import { Router } from "express";
import {
  createExercise,
  getAllExercises,
} from "../controllers/exerciseController.js";

const exerciseRouter = Router();

exerciseRouter.post("/new", createExercise);
exerciseRouter.get("/", getAllExercises);

export default exerciseRouter;
