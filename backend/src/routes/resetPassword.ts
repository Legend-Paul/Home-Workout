import { Router } from "express";
import { resetPassword } from "../controllers/resetPaswordController.js";

const resetPasswordRouter = Router();

resetPasswordRouter.put("/new", resetPassword);

export default resetPasswordRouter;
