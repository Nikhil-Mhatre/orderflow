import type { ErrorRequestHandler } from "express";

import { AppError } from "./app.error.js";
import { logger } from "../../config/logger.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  logger.error(
    { method: req.method, url: req.originalUrl, error },
    "Unhandled application error",
  );

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
