import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../lib/errors/app.error.js";
import { sendData } from "../../lib/http/response.js";

import { productService } from "./product.service.js";
import { getProductParamsSchema } from "./product.validation.js";

/**
 * GET /products
 *
 * Returns all active products available for ordering.
 */
export async function getProductsController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await productService.getAll();

    sendData(res, products);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /products/:productId
 *
 * Returns a single active product.
 */
export async function getProductByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { productId } = getProductParamsSchema.parse(req.params);

    const product = await productService.getById(productId);

    if (!product) {
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
    }

    sendData(res, product);
  } catch (error) {
    next(error);
  }
}
