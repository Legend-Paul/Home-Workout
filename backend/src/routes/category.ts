import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = Router();

// Define your category routes here
categoryRouter.get("/", getCategories);
categoryRouter.post("/new", createCategory);
categoryRouter.get("/:name", getCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
