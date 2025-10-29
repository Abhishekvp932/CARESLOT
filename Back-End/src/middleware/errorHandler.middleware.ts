import { ErrorRequestHandler } from 'express';
import logger from '../utils/logger';
import { HttpStatus } from '../utils/httpStatus';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

  logger.error(err);

  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ msg: message });
};
