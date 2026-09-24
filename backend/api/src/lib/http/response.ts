import type { Response } from "express";

import type { ApiResponse, PaginatedResponse, Pagination } from "./types.js";

export function sendData<T>(res: Response, data: T, statusCode = 200) {
  const response: ApiResponse<T> = {
    data,
  };

  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: Pagination,
) {
  const response: PaginatedResponse<T> = {
    data,
    pagination,
  };

  return res.status(200).json(response);
}
