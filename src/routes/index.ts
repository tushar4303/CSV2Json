import { Request, Response } from "express";
import { executeQuery } from "../database";
import { appAuth } from "../hooks";
import { uploadCSVFromFile, uploadCSVFromLocal } from "../controllers";
import { uploadCSVFile } from "../middleware/upload-csv";

export const appRoutes = [
  {
    method: "get",
    path: "/health",
    action: async (req: Request, res: Response) => {
      const msg = "Welcome to CSV2JSON";
      try {
        const dbStatus: any = await executeQuery(`SELECT 1 as OK`);
        res.send({
          msg,
          dbStatus,
          status: process.env.BUILD_NUMBER || "NA",
        });
      } catch (error) {
        res.send({
          msg,
          dbStatus: error,
          status: process.env.BUILD_NUMBER || "NA",
        });
      }
    }
  },
  {
    method: "post",
    path: "/upload-csv",
    preHook: [appAuth, uploadCSVFile],
    action: uploadCSVFromFile
  },
  {
    method: "get",
    path: "/process-local-csv",
    preHook: [appAuth],
    action: uploadCSVFromLocal
  }
];
