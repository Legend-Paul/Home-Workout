import { Router } from "express";
import { verifyVerificationEmail } from "../controllers/verificationEmail.js";

const verificationEmailRouter = Router();
verificationEmailRouter.post("/signup/:token", verifyVerificationEmail);
export default verificationEmailRouter;
