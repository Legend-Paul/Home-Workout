import { Router } from "express";
import { updatePassword } from "../controllers/forgotPaswordController.js";

const forgotPaswordRouter = Router();

forgotPaswordRouter.put("/", updatePassword);

export default forgotPaswordRouter;
