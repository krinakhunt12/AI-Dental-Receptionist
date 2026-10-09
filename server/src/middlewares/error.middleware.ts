import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    const target = err.meta?.target ? ` (${(err.meta.target as string[]).join(', ')})` : '';
    message = `Duplicate record entry${target}`;
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'Record not found';
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Malformed JSON body in request';
  } else {
    logger.error('Unhandled Error:', err);
    if (process.env.NODE_ENV === 'development') {
      message = err.message || message;
    }
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
