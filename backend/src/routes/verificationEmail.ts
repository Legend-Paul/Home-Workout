import { Router } from "express";
import { verifyVerificationEmail } from "../controllers/verificationEmail.js";

const verificationEmailRouter = Router();
verificationEmailRouter.put("/verify/:token", verifyVerificationEmail);
export default verificationEmailRouter;
