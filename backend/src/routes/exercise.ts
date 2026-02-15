import { Router } from "express";
import {
  createExercise,
  getAllExercises,
} from "../controllers/exerciseController.js";
import { uploadImage } from "../middleware/multer.js";
import multerError from "../middleware/multerError.js";

const exerciseRouter = Router();

exerciseRouter.get("/", uploadImage.single("image"), getAllExercises);
exerciseRouter.post("/new", createExercise);
exerciseRouter.use(multerError);

export default exerciseRouter;
