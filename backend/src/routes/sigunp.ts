import { Router } from "express";
import { createUser } from "../controllers/sigunpController.js";
import emailLimit from "../middleware/rateLimit.js";

const sigunpRouter = Router();

sigunpRouter.post("/", emailLimit, createUser);

export default sigunpRouter;
