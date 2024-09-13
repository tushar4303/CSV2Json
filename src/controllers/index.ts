import * as multer from 'multer';
import * as fs from 'fs';
import { Request, Response, NextFunction } from "express";
import { AppError } from '../services/utils/error.utils';
import { successResponse, sendErrorResponse } from '../services/utils/response-wrapper';

interface MulterRequest extends Request {
  file?: Express.Multer.File; 
}
const cleanCSVValue = (value: string) => {
  return value?.trim().replace(/^"+|"+$/g, ''); 
};
const parseCSVToJSON = (csvData: string) => {
  const [headers, ...rows] = csvData?.split('\n')?.map(row => row?.split(',').map(cleanCSVValue));

  const setNestedValue = (obj: any, keys: string[], value: any) => {
    let currentObj = obj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys?.length - 1) {
        if (value !== undefined && value !== null && value !== '') {
          currentObj[key] = value;
        }
      } else {
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        currentObj = currentObj[key];
      }
    }
  };

  return rows.map(row => {
    const obj: any = {};
    for (let i = 0; i < row?.length; i++) {
      const value = row[i];
      const keys = headers?.[i]?.split('.').map(cleanCSVValue);
      if (keys && value !== undefined && value !== null) {
        setNestedValue(obj, keys, value);
      }
    }
    return obj;
  });
};


export const uploadCSV = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('CSV file required', 400);
    }

    const csvData = fs.readFileSync(req.file.path, 'utf8');

    const jsonData = parseCSVToJSON(csvData);
    console.log('JSON Content:', jsonData
    );
    
    fs.unlinkSync(req.file.path);

    return res.send(
      successResponse("uploadCSV - success", { message: "CSV file uploaded and printed successfully" })
    );
  } catch (error: any) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    sendErrorResponse(res, error, "ERROR IN uploadCSV");
  }
};