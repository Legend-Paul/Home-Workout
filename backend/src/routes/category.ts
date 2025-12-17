import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
} from "../controllers/categoryController.js";

const categoryRouter = Router();

// Define your category routes here
categoryRouter.post("/new", createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:name", getCategory);

export default categoryRouter;
