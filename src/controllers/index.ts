import * as fs from 'fs';
import { Response } from "express";
import { AppError } from '../services/utils/error.utils';
import { successResponse, sendErrorResponse } from '../services/utils/response-wrapper';
import { cleanCSVValue, roundToTwoDecimals, setNestedValue } from '../services/utils/parse-csv.utils';
import { IMulterRequest } from '../interfaces/multer';
import { getUserByAge, insertUsers } from '../models/users';
import * as dotenv from 'dotenv';
dotenv.config();

const parseCSVToJSON = (csvData: string) => {
  try {
    const [headers, ...rows] = csvData?.split('\n')?.map(row => row?.split(',').map(value => cleanCSVValue(value)));

    const parsedJson = rows?.map(row => {
      const obj: any = {};
      for (let i = 0; i < row?.length; i++) {
        const value = row[i];
        const keys = headers?.[i]?.split('.').map(value => cleanCSVValue(value));
        if (keys && value !== undefined && value !== null) {
          setNestedValue(obj, keys, value);
        }
      }
      return obj;
    });

    return parsedJson || [];
  } catch (error) {
    console.error('Error in parseCSVToJSON:', error);
    return []
  }
};

const processCSV = async (csvData: string, res: Response) => {
  try {
    const jsonData = parseCSVToJSON(csvData);

    if(jsonData?.length === 0) {
      throw new AppError('Empty CSV', 400);
    }

    const result = await insertUsers(jsonData);

    let formattedData: any = [];
    if (result) {
      const ageData = await getUserByAge();
      const { totalUsers, lessThan20, between20And40, between40And60, greaterThan60 } = ageData;

      formattedData = [
        { AgeGroup: '< 20', percentage: roundToTwoDecimals((lessThan20 / totalUsers) * 100) },
        { AgeGroup: '20 to 40', percentage: roundToTwoDecimals((between20And40 / totalUsers) * 100) },
        { AgeGroup: '40 to 60', percentage: roundToTwoDecimals((between40And60 / totalUsers) * 100) },
        { AgeGroup: '> 60', percentage: roundToTwoDecimals((greaterThan60 / totalUsers) * 100) },
      ];
      console.table(formattedData);
    } else {
      throw new AppError('Could not insert data', 500);
    }

    const data = {
      jsonData,
      ageData: formattedData
    }

    return data || {};
  } catch (error: any) {
    console.error(error, "ERROR IN processCSV");
    return {};
  }
};

export const uploadCSVFromFile = async (req: IMulterRequest, res: Response) => {
  try {
    const file = req?.file;
    if (!file) {
      throw new AppError('CSV file required', 400);
    }

    const csvData = fs.readFileSync(file?.path, 'utf8');

    const data = await processCSV(csvData, res);
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

    const csvData = fs.readFileSync(csvFilePath, 'utf8');

    const data = await processCSV(csvData, res);
    return res.send(
      successResponse("uploadCSVFromLocal - success", { message: "CSV file data has been uploaded successfully to database", data })
    );
  } catch (error: any) {
    sendErrorResponse(res, error, "ERROR IN uploadCSVFromLocal");
  }
};
