import { Router } from "express";
import {
  sendEmailConfirmation,
  resendEmailConfirmation,
} from "../controllers/forgotPaswordController.js";
import { resetPassword } from "../controllers/resetPaswordController.js";
import emailLimit from "../middleware/rateLimit.js";

const forgotPasswordRouter = Router();

forgotPasswordRouter.post("/reset", resetPassword);
forgotPasswordRouter.post("/resend", emailLimit, resendEmailConfirmation);
forgotPasswordRouter.post("/", sendEmailConfirmation);
export default forgotPasswordRouter;
