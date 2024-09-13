import { NextFunction } from "express";
import * as multer from "multer";
import { AppError } from "../services/utils/error.utils";
import { upload } from "../services/multer/upload";
import { Request, Response } from "express";

export const uploadCSVFile = (req: Request, res: Response, next: NextFunction) => {
  upload.single('csvFile')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return next(new AppError(err.message, 400));
    } else if (err) {
      return next(new AppError('An error occurred during file upload', 500));
    }
    next();
  });
};