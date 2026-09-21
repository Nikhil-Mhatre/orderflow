import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Order } from "../../../src/types/order.types.js";

/*
 * vi.mock() is hoisted by Vitest.
 *
 * Therefore, values referenced inside the mock factory must be created
 * with vi.hoisted() so they are initialized before the mock is evaluated.
 */
const databaseMock = vi.hoisted(() => ({
  insert: vi.fn(),
  select: vi.fn(),
}));

/*
 * Mock the database client used by order.service.ts.
 *
 * The real PostgreSQL/Drizzle client will not be loaded during these tests.
 */
vi.mock("../../../src/db/client.js", () => ({
  db: databaseMock,
}));

/*
 * Import the service after declaring the database mock.
 *
 * Vitest will provide the mocked db module when this file is evaluated.
 */
import { createOrder, getOrderById, getOrders } from "../../../src/services/order.service.js";
const sampleOrder: Order = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  customerName: "Nikhil",
  product: "Mechanical Keyboard",
  quantity: 2,
  status: "PENDING",
  createdAt: new Date("2026-09-13T08:00:00.000Z"),
  updatedAt: new Date("2026-09-13T08:00:00.000Z"),
};

describe("order.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("creates an order with PENDING status", async () => {
      /*
       * Mock the Drizzle insert chain:
       *
       * db.insert(orders)
       *   .values(...)
       *   .returning()
       */
      const returningMock = vi.fn().mockResolvedValue([sampleOrder]);

      const valuesMock = vi.fn().mockReturnValue({
        returning: returningMock,
      });

      databaseMock.insert.mockReturnValue({
        values: valuesMock,
      });

      const result = await createOrder({
        customerName: "Nikhil",
        product: "Mechanical Keyboard",
        quantity: 2,
      });

      expect(result).toEqual(sampleOrder);

      expect(databaseMock.insert).toHaveBeenCalledTimes(1);

      expect(valuesMock).toHaveBeenCalledWith({
        customerName: "Nikhil",
        product: "Mechanical Keyboard",
        quantity: 2,
        status: "PENDING",
      });

      expect(returningMock).toHaveBeenCalledTimes(1);
    });

    it("throws when the database does not return the created order", async () => {
      const returningMock = vi.fn().mockResolvedValue([]);

      const valuesMock = vi.fn().mockReturnValue({
        returning: returningMock,
      });

      databaseMock.insert.mockReturnValue({
        values: valuesMock,
      });

      await expect(
        createOrder({
          customerName: "Nikhil",
          product: "Mechanical Keyboard",
          quantity: 2,
        }),
      ).rejects.toThrow("Order was not returned after creation");
    });
  });

  describe("getOrders", () => {
    it("returns all orders and their total count", async () => {
      const orderRows = [sampleOrder];

      const orderByMock = vi.fn().mockResolvedValue(orderRows);

      const fromMock = vi.fn().mockReturnValue({
        orderBy: orderByMock,
      });

      databaseMock.select.mockReturnValue({
        from: fromMock,
      });

      const result = await getOrders();

      expect(result).toEqual({
        orders: orderRows,
        total: 1,
      });

      expect(databaseMock.select).toHaveBeenCalledTimes(1);
      expect(fromMock).toHaveBeenCalledTimes(1);
      expect(orderByMock).toHaveBeenCalledTimes(1);
    });

    it("returns an empty collection when no orders exist", async () => {
      const orderByMock = vi.fn().mockResolvedValue([]);

      const fromMock = vi.fn().mockReturnValue({
        orderBy: orderByMock,
      });

      databaseMock.select.mockReturnValue({
        from: fromMock,
      });

      const result = await getOrders();

      expect(result).toEqual({
        orders: [],
        total: 0,
      });
    });
  });

  describe("getOrderById", () => {
    it("returns an order when the ID exists", async () => {
      const limitMock = vi.fn().mockResolvedValue([sampleOrder]);

      const whereMock = vi.fn().mockReturnValue({
        limit: limitMock,
      });

      const fromMock = vi.fn().mockReturnValue({
        where: whereMock,
      });

      databaseMock.select.mockReturnValue({
        from: fromMock,
      });

      const result = await getOrderById(sampleOrder.id);

      expect(result).toEqual({
        order: sampleOrder,
      });

      expect(databaseMock.select).toHaveBeenCalledTimes(1);
      expect(fromMock).toHaveBeenCalledTimes(1);
      expect(whereMock).toHaveBeenCalledTimes(1);
      expect(limitMock).toHaveBeenCalledWith(1);
    });

    it("throws a 404 AppError when the order does not exist", async () => {
      const limitMock = vi.fn().mockResolvedValue([]);

      const whereMock = vi.fn().mockReturnValue({
        limit: limitMock,
      });

      const fromMock = vi.fn().mockReturnValue({
        where: whereMock,
      });

      databaseMock.select.mockReturnValue({
        from: fromMock,
      });

      await expect(getOrderById(sampleOrder.id)).rejects.toMatchObject({
        message: `Order not found: ${sampleOrder.id}`,
        statusCode: 404,
        isOperational: true,
      });
    });
  });
});
