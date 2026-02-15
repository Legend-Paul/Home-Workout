import { Router } from "express";
import { sendEmailConfirmation } from "../controllers/forgotPaswordController.js";
import emailLimit from "../middleware/rateLimit.js";

const forgotPaswordRouter = Router();

forgotPaswordRouter.post("/", emailLimit, sendEmailConfirmation);
export default forgotPaswordRouter;
