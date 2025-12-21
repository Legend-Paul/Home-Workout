import { Router } from "express";
import { createUser, updateGoal } from "../controllers/sigunpController.js";

const sigunpRouter = Router();

sigunpRouter.post("/", createUser);
sigunpRouter.put("/:id/goal", updateGoal);

export default sigunpRouter;
