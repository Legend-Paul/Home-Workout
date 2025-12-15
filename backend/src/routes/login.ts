import { Router } from "express";
import { validateUser } from "../controllers/loginController.js";

const loginRouter = Router();

loginRouter.post("/", validateUser);

export default loginRouter;
