import { Router } from "express";
import { createUser } from "../controllers/sigunpController.js";
import {
  verifyVerificationEmail,
  resendVerificationEmail,
} from "../controllers/verificationEmail.js";
import emailLimit from "../middleware/rateLimit.js";

const sigunpRouter = Router();

sigunpRouter.post("/verify-email/resend", emailLimit, resendVerificationEmail);
sigunpRouter.post("/verify-email", verifyVerificationEmail);
sigunpRouter.post("/", emailLimit, createUser);

export default sigunpRouter;
