import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { db, pool } from "../../src/db/client.js";
import { orders } from "../../src/db/schema.js";

describe("Orders API integration tests", () => {
  let createdOrderId: string;

  beforeAll(async () => {
    await pool.query("SELECT 1");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("POST /orders creates an order", async () => {
    const response = await request(app).post("/orders").send({
      customerName: "Integration Test Customer",
      product: "Integration Test Product",
      quantity: 2,
    });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      order: {
        customerName: "Integration Test Customer",
        product: "Integration Test Product",
        quantity: 2,
        status: "PENDING",
      },
    });

    expect(response.body.order.id).toEqual(expect.any(String));

    createdOrderId = response.body.order.id;
  });

  it("GET /orders returns the order list", async () => {
    const response = await request(app).get("/orders");

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("orders");
    expect(response.body).toHaveProperty("total");
    expect(Array.isArray(response.body.orders)).toBe(true);

    expect(response.body.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdOrderId,
          customerName: "Integration Test Customer",
          product: "Integration Test Product",
          quantity: 2,
          status: "PENDING",
        }),
      ]),
    );
  });

  it("GET /orders/:id returns a single order", async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      order: {
        id: createdOrderId,
        customerName: "Integration Test Customer",
        product: "Integration Test Product",
        quantity: 2,
        status: "PENDING",
      },
    });
  });

  it("GET /orders/:id returns 404 for an unknown order", async () => {
    const response = await request(app).get("/orders/00000000-0000-0000-0000-000000000000");

    expect(response.status).toBe(404);
  });

  it("POST /orders rejects an invalid quantity", async () => {
    const response = await request(app).post("/orders").send({
      customerName: "Invalid Quantity Test",
      product: "Test Product",
      quantity: 0,
    });

    expect(response.status).toBe(400);
  });

  it("POST /orders rejects a missing customer name", async () => {
    const response = await request(app).post("/orders").send({
      product: "Test Product",
      quantity: 1,
    });

    expect(response.status).toBe(400);
  });
});
