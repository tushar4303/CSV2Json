import { AppError } from "./error.utils";

export const errorResponse = (
  statusCode: number,
  message = "some unexpected error occured",
  data = {}
) => {
  const responseObj = {
    status: false,
    statusCode,
    message,
    data,
  };
  return responseObj;
};

export const successResponse = (message: string, data: any) => {
  const responseObj = {
    status: true,
    statusCode: 200,
    message,
    data,
  };
  return responseObj;
};


export const sendErrorResponse = (res, err: any, message: string) => {
  const statusCode = Number((err as AppError)?.code) || 500
  const errMessage = (err as AppError | Error)?.message || "Something went wrong"
  const errData = (err as AppError)?.dataToSend || {}
  console.error(err, message, JSON.stringify(errData))
  return res.status(statusCode).send(errorResponse(statusCode, errMessage, errData))
}