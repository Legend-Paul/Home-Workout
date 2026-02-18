import { Router } from "express";
import { createUser } from "../controllers/sigunpController.js";
import { verifyVerificationEmail } from "../controllers/verificationEmail.js";
import emailLimit from "../middleware/rateLimit.js";

const sigunpRouter = Router();

sigunpRouter.post("/", emailLimit, createUser);
sigunpRouter.post("verify-email", verifyVerificationEmail);

export default sigunpRouter;
