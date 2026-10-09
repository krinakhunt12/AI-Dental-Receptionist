import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed && typeof parsed === 'object') {
        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;
      }

      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        const issues = error.issues || error.errors || [];
        const formattedErrors = issues.map((e: any) => ({
          field: Array.isArray(e.path) ? e.path.join('.').replace(/^(body|query|params)\./, '') : '',
          message: e.message,
        }));
        return next(ApiError.badRequest('Validation failed', formattedErrors));
      }
      next(error);
    }
  };
};
