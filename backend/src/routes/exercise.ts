// exerciseRouter.ts
import { Router } from "express";
import {
  createExercise,
  getAllExercises,
} from "../controllers/exerciseController.js";
import { uploadImageAndVideo } from "../middleware/multer.js";
import multerError from "../middleware/multerError.js";

const exerciseRouter = Router();

exerciseRouter.get("/", getAllExercises);

// Separate fields for image and video
exerciseRouter.post(
  "/new",
  uploadImageAndVideo.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createExercise,
);

// Error handler MUST be last
exerciseRouter.use(multerError);

export default exerciseRouter;
