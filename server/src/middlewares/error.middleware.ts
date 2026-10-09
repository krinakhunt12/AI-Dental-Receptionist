import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Internal Server Error';
  let details: any = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.errors || null;
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    code = 'CONFLICT';
    const target = err.meta?.target ? ` (${(err.meta.target as string[]).join(', ')})` : '';
    message = `Duplicate record entry${target}`;
    details = err.meta || null;
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Record not found';
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    code = 'BAD_REQUEST';
    message = 'Malformed JSON body in request';
  } else {
    logger.error('Unhandled Error:', err);
    if (process.env.NODE_ENV === 'development') {
      message = err.message || message;
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
