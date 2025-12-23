import { Router } from "express";
import { updateUsename } from "../controllers/userController.js";

const userRouter = Router();
userRouter.put("/:id/update-username", updateUsename);

export default userRouter;
