// exerciseRouter.ts
import { Router } from "express";
import {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deactivateExercise,
  activateExercise,
  deleteExercise,
} from "../controllers/exerciseController.js";
import { uploadImageAndVideo } from "../middleware/multer.js";
import multerError from "../middleware/multerError.js";

const exerciseRouter = Router();

// Separate fields for image and video
exerciseRouter.post(
  "/new",
  uploadImageAndVideo.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createExercise,
);

exerciseRouter.get("/", getAllExercises);
exerciseRouter.get("/:id", getExerciseById);

exerciseRouter.put(
  "/:id",
  uploadImageAndVideo.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateExercise,
);
exerciseRouter.delete("/:id", deleteExercise);

exerciseRouter.put("/:id/deactivate", deactivateExercise);
exerciseRouter.put("/:id/activate", activateExercise);

// Error handler MUST be last
exerciseRouter.use(multerError);

export default exerciseRouter;
