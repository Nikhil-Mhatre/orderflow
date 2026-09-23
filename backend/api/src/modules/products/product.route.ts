import { Router } from "express";

import {
  getProductByIdController,
  getProductsController,
} from "./product.controller.js";

const productRouter = Router();

/**
 * GET /products
 */
productRouter.get("/", getProductsController);

/**
 * GET /products/:productId
 */
productRouter.get("/:productId", getProductByIdController);

export { productRouter };
