import { NextFunction } from 'express';
import { sendErrorResponse } from '../services/utils/response-wrapper.utils';
import { AppError } from '../services/utils/error.utils';
import * as dotenv from 'dotenv';
dotenv.config();

export const appAuth = (req: any, res: any, next: NextFunction) => {
    const { appsecret } = req?.headers;
    try {
        if (appsecret !== process?.env?.APP_SECRET) {
            throw new AppError('Unauthorized', 401, { path: req?.url });
        } else {
            return next();
        }
    } catch (err) {
        return sendErrorResponse(res, err, 'Error in appAuth');
    }
};
