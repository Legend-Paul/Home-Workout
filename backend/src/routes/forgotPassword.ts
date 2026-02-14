import { Router } from "express";
import { updatePassword } from "../controllers/forgotPaswordController.js";

const forgotPaswordRouter = Router();

forgotPaswordRouter.post("/", updatePassword);

export default forgotPaswordRouter;
