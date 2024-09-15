import * as fs from 'fs';
import { Response } from "express";
import { AppError } from '../services/utils/error.utils';
import { successResponse, sendErrorResponse } from '../services/utils/response-wrapper.utils';
import { IMulterRequest } from '../interfaces/multer';
import * as dotenv from 'dotenv';
import { processCSV } from '../services/utils/parse-csv.utils';
dotenv.config();

export const uploadCSVFromFile = async (req: IMulterRequest, res: Response) => {
  try {
    const file = req?.file;
    if (!file) {
      throw new AppError('CSV file required', 400);
    }

    const data = await processCSV(file?.path);
    fs.unlinkSync(file?.path);
    return res.send(
      successResponse("uploadCSVFromFile - success", { message: "CSV file data has been uploaded successfully to database", data })
    );

  } catch (error: any) {
    if (req?.file) {
      fs.unlinkSync(req?.file?.path);
    }
    sendErrorResponse(res, error, "ERROR IN uploadCSVFromFile");
  }
};

export const uploadCSVFromLocal = async (req: Request, res: Response) => {
  try {
    const csvFilePath = process?.env?.CSV_FILE_PATH;
    if (!csvFilePath) {
      throw new AppError('No CSV file path found in .env', 400);
    }

    const data = await processCSV(csvFilePath);
    return res.send(
      successResponse("uploadCSVFromLocal - success", { message: "CSV file data has been uploaded successfully to database", data })
    );
  } catch (error: any) {
    sendErrorResponse(res, error, "ERROR IN uploadCSVFromLocal");
  }
};
