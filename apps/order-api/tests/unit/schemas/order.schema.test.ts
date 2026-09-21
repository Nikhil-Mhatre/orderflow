import { describe, expect, it } from "vitest";

import { createOrderSchema } from "../../../src/schemas/order.schema.js";

describe("createOrderSchema", () => {
  /*
   * A valid request should pass validation.
   *
   * The schema should preserve the expected values and types.
   */
  it("accepts a valid order payload", () => {
    const input = {
      customerName: "Nikhil",
      product: "Mechanical Keyboard",
      quantity: 2,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  /*
   * Customer names are required and cannot be empty.
   */
  it("rejects an empty customer name", () => {
    const input = {
      customerName: "",
      product: "Mechanical Keyboard",
      quantity: 2,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Product names are required and cannot be empty.
   */
  it("rejects an empty product name", () => {
    const input = {
      customerName: "Nikhil",
      product: "",
      quantity: 2,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Quantity must be greater than zero.
   */
  it("rejects a zero quantity", () => {
    const input = {
      customerName: "Nikhil",
      product: "Mechanical Keyboard",
      quantity: 0,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Negative quantities are invalid.
   */
  it("rejects a negative quantity", () => {
    const input = {
      customerName: "Nikhil",
      product: "Mechanical Keyboard",
      quantity: -1,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Quantity must be an integer.
   */
  it("rejects a fractional quantity", () => {
    const input = {
      customerName: "Nikhil",
      product: "Mechanical Keyboard",
      quantity: 1.5,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * The schema expects a number, not a numeric string.
   */
  it("rejects a string quantity", () => {
    const input = {
      customerName: "Nikhil",
      product: "Mechanical Keyboard",
      quantity: "2",
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Missing required fields should fail validation.
   */
  it("rejects a payload with missing fields", () => {
    const input = {
      customerName: "Nikhil",
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Whitespace around strings should be removed by the schema's trim()
   * validation.
   */
  it("trims customer name and product values", () => {
    const input = {
      customerName: "  Nikhil  ",
      product: "  Mechanical Keyboard  ",
      quantity: 2,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        customerName: "Nikhil",
        product: "Mechanical Keyboard",
        quantity: 2,
      });
    }
  });

  /*
   * Customer names longer than 255 characters are invalid.
   */
  it("rejects an excessively long customer name", () => {
    const input = {
      customerName: "a".repeat(256),
      product: "Mechanical Keyboard",
      quantity: 2,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
   * Product names longer than 255 characters are invalid.
   */
  it("rejects an excessively long product name", () => {
    const input = {
      customerName: "Nikhil",
      product: "a".repeat(256),
      quantity: 2,
    };

    const result = createOrderSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});
