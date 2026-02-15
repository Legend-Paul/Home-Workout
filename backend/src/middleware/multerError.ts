// multerError.ts
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
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        error:
          "File too large. Maximum size is 50MB for videos and 5MB for images.",
      });
      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        error: "Too many files. Maximum is 5 files.",
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
    return;
  } else if (error) {
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  next();
};

export default multerError;
