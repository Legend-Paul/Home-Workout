import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";

const validate = [
  body()
    .isArray({ min: 1 })
    .withMessage("Request body must be a non-empty array"),
  body("*.name").isString().withMessage("Name must be a string"),
  body("*.description").isString().withMessage("Description must be a string"),
  body("*.order")
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),
  body("*.imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL if provided"),
];

interface CategoryRequest extends Request {
  body: Array<{
    name: string;
    description: string;
    order: number;
    imageUrl?: string;
  }>;
}

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
    const categories = req.body;
    const currentCategories = await prisma.category.findMany();

    currentCategories.forEach((existingCategory) => {
      const category = categories.find(
        (cat) => cat.name === existingCategory.name
      );
      if (category) {
        res.status(400).json({ message: "Category already exists", category });
        return;
      }
    });

    const category = await prisma.category.createMany({
      data: categories,
    });

    console.log(category);

    if (category.count === 0) {
      res.status(400).json({ error: "No categories were created" });
      return;
    }

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

const createCategory = [...validate, categoryHandler];

export { createCategory };
