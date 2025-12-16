import { Router } from "express";
import { categoryHandler } from "../controllers/categoryController.js";

const categoryRouter = Router();

// Define your category routes here
categoryRouter.get("/", categoryHandler);

export default categoryRouter;
