// multer.ts
import multer, { type FileFilterCallback } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import type { Request } from "express";
import cloudinary from "../lib/cloudinary.js";

// Image file filter
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      ),
    );
  }
};

// Video file filter
const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimes: string[] = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
    "video/webm",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only MP4, MPEG, MOV, AVI, and WebM videos are allowed.",
      ),
    );
  }
};

// Combined image and video filter
const mediaFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MPEG, MOV, AVI, WebM) are allowed.",
      ),
    );
  }
};

// Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fittrack/images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    resource_type: "image",
  } as any,
});

// Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fittrack/videos",
    allowed_formats: ["mp4", "mpeg", "mov", "avi", "webm"],
    resource_type: "video",
  } as any,
});

// Cloudinary storage for mixed media (detects type from mimetype)
const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: (req: Request, file: Express.Multer.File) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: isVideo ? "fittrack/videos" : "fittrack/images",
      resource_type: isVideo ? "video" : "image",
    };
  },
});

// Single image upload
export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

// Multiple images upload
export const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: imageFileFilter,
});

// Single video upload
export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: videoFileFilter,
});

// Multiple videos upload
export const uploadVideos = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024, files: 3 },
  fileFilter: videoFileFilter,
});

// Combined media upload (images and/or videos)
export const uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 50 * 1024 * 1024, files: 5 },
  fileFilter: mediaFileFilter,
});

// Multiple fields (separate image and video fields)
export const uploadImageAndVideo = multer({
  storage: mediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: mediaFileFilter,
});
