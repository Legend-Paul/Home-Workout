import { Router } from "express";
import { sendEmailConfirmation } from "../controllers/forgotPaswordController.js";

const forgotPaswordRouter = Router();

forgotPaswordRouter.post("/", sendEmailConfirmation);
export default forgotPaswordRouter;
