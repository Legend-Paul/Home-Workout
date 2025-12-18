import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body("name").isString().withMessage("Name must be a string"),
  body("description").isString().withMessage("Description must be a string"),
  body("order")
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL if provided"),
];

interface CategoryRequest extends Request {
  body: {
    name: string;
    description: string;
    order: number;
    imageUrl?: string;
  };
}

// Create category handler
const categoryHandler = async (
  req: CategoryRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, description, order, imageUrl } = req.body;
    const categoryExists = await prisma.category.findUnique({
      where: { name },
    });
    if (categoryExists) {
      res.status(409).json({ error: "Category with this name already exists" });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        order,
        imageUrl: imageUrl || null,
      },
    });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const createCategory = [...validate, categoryHandler];

// Get all categories
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve categories" });
  }
};

interface GetCategoryRequest extends Request {
  params: {
    name: string;
  };
}

// get a specific category
export const getCategory = async (
  req: GetCategoryRequest,
  res: Response
): Promise<void> => {
  const { name } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { name: name.charAt(0).toUpperCase() + name.slice(1) },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve category" });
  }
};

// Update a specific category
interface UpdateCategoryRequest extends CategoryRequest {
  params: {
    id: string;
  };
}

const updateCategoryHandler = async (
  req: UpdateCategoryRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, description, order, imageUrl } = req.body;
  const categoryId = req.params.id;

  try {
    const categoryExists = await prisma.category.findUnique({
      where: { name: categoryId },
    });

    if (!categoryExists) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description,
        order,
        imageUrl: imageUrl || null,
      },
    });

    res
      .status(201)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

export const updateCategory = [...validate, updateCategoryHandler];

// delete a specific category
export const deleteCategory = async (
  req: UpdateCategoryRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await prisma.category.delete({
      where: { id },
    });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
