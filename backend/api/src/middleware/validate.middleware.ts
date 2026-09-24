import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

import { AppError } from "../lib/errors/app.error.js";

export function validateBody<T>(schema: ZodType<T>) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

      next(new AppError(message, 400));
      return;
    }

    request.body = result.data;
    next();
  };
}
