import { insertUsers, getUserByAge } from "../../models/users";
import { AppError } from "./error.utils";
import { createReadStream } from 'fs';
import * as readline from 'node:readline/promises';

export const cleanCSVValue = (value: string) => {
  return value?.trim().replace(/^"+|"+$/g, ''); 
};

export const setNestedValue = (obj: any, keys: string[], value: any) => {
  let currentObj = obj;
  for (let i = 0; i < keys?.length; i++) {
    const key = keys[i];
    if (i === keys?.length - 1) {
      if (value !== undefined && value !== null && value !== '') {
        currentObj[key] = value;
      }
    } else {
      currentObj[key] = currentObj[key] || {};
      currentObj = currentObj[key];
    }
  }
};

export const roundToTwoDecimals = (number: number) => number?.toFixed(2);

export const parseCSVToJSON = async (filePath: string) => {
  try {
    const fileStream = createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    let headers: string[] | null = null;
    let parsedJson: any[] = [];
  
    for await (const line of rl) {
      if (!headers) {
        headers = line?.split(',').map(cleanCSVValue);
        continue;
      }
  
      const row = line?.split(',').map(cleanCSVValue);
      const obj: any = {};
      for (let i = 0; i < row?.length; i++) {
        const value = row[i];
        const keys = headers[i]?.split('.').map(cleanCSVValue);
        if (keys && value !== undefined && value !== null) {
          setNestedValue(obj, keys, value);
        }
      }
      parsedJson?.push(obj);
    }
  
    return parsedJson;
  } catch (error: any) {
    console.error(error, "ERROR IN parseCSVToJSON");
    return [];
  }
};

export const processCSV = async (filePath: string) => {
  try {
    const jsonData = await parseCSVToJSON(filePath);

    if(jsonData?.length === 0) {
      throw new AppError('Empty CSV', 400);
    }

    const result = await insertUsers(jsonData);
    const rowsInserted = jsonData?.length

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
      rowsInserted, 
      ageData: formattedData
    }

    return data || {};
  } catch (error: any) {
    console.error(error, "ERROR IN processCSV");
    return {};
  }
};
