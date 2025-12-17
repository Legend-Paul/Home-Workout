import { Router } from "express";
import { createCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();

// Define your category routes here
categoryRouter.post("/", createCategory);

export default categoryRouter;
