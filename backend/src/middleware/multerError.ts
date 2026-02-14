import type { Request, Response, NextFunction } from "express";
import multer, { type MulterError } from "multer";

type UploadError = Error | MulterError;

const multerError = (
  error: UploadError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof multer.MulterError) {
    // Multer-specific errors
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        error: "File too large. Maximum size is 1MB.",
      });
      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        error: "Too many files. Maximum is 12 files.",
      });
      return;
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        error: "Unexpected field name in form data.",
      });
      return;
    }

    res.status(400).json({
      error: error.message,
    });
  } else if (error) {
    // Other errors (like file filter errors)
    res.status(400).json({
      error: error.message,
    });
  }
  next();
};

export default multerError;
