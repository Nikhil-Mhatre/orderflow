import type { Request, Response } from "express";

import { productService } from "./product.service.js";
import { getProductParamsSchema } from "./product.validation.js";

// -----------------------------------------------------------------------------
// Get all products
// -----------------------------------------------------------------------------

/**
 * GET /products
 *
 * Returns all active products available for ordering.
 */
export async function getProductsController(
  _req: Request,
  res: Response,
): Promise<void> {
  const result = await productService.getAll();

  res.status(200).json(result);
}

// -----------------------------------------------------------------------------
// Get product by ID
// -----------------------------------------------------------------------------

/**
 * GET /products/:productId
 *
 * Returns a single active product.
 */
export async function getProductByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  const { productId } = getProductParamsSchema.parse(req.params);

  const product = await productService.getById(productId);

  if (!product) {
    res.status(404).json({
      message: "Product not found",
    });

    return;
  }

  res.status(200).json(product);
}
