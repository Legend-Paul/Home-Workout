import type { Request, Response } from "express";

const createUser = (req: Request, res: Response) => {
  // Implementation for creating a user
  res.status(201).send("User created");
};

export { createUser };
