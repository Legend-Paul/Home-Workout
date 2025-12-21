import { Router } from "express";
import {
  createUser,
  updateGoal,
  updateLevel,
} from "../controllers/sigunpController.js";

const sigunpRouter = Router();

sigunpRouter.post("/", createUser);
sigunpRouter.put("/:id/goal", updateGoal);
sigunpRouter.put("/:id/level", updateLevel);

export default sigunpRouter;
