import type { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user!.role !== "ADMIN" && req.user!.role !== "MASTER") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};

export default requireAdmin;
