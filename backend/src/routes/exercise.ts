// exerciseRouter.ts
import { Router } from "express";
import {
  createExercise,
  getAllExercises,
  getExerciseById,
  getExerciseByMuscleGroup,
  updateExercise,
  deactivateExercise,
  activateExercise,
  deleteExercise,
} from "../controllers/exerciseController.js";
import { uploadImageAndVideo } from "../middleware/multer.js";
import multerError from "../middleware/multerError.js";
import requireAdmin from "../middleware/requireAuth.js";

const exerciseRouter = Router();

// Separate fields for image and video
exerciseRouter.post(
  "/new",
  requireAdmin,
  uploadImageAndVideo.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createExercise,
);

exerciseRouter.get("/", getAllExercises);
exerciseRouter.get("/muscle-group", getExerciseByMuscleGroup);
exerciseRouter.get("/:id", getExerciseById);

exerciseRouter.put(
  "/:id",
  requireAdmin,
  uploadImageAndVideo.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateExercise,
);
exerciseRouter.delete("/:id", requireAdmin, deleteExercise);

exerciseRouter.put("/:id/deactivate", requireAdmin, deactivateExercise);
exerciseRouter.put("/:id/activate", requireAdmin, activateExercise);

// Error handler MUST be last
exerciseRouter.use(multerError);

export default exerciseRouter;
