import { Router } from "express";
import { createUser } from "../controllers/sigunpController.js";

const sigunpRouter = Router();

sigunpRouter.post("/", createUser);

export default sigunpRouter;
