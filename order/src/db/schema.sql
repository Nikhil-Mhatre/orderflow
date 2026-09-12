-- ============================================================
-- OrderFlow Database Schema
-- ============================================================
--
-- This schema defines the persistent data required by the
-- Order API and Order Worker.
--
-- Order lifecycle:
--
-- PENDING
--    |
--    v
-- PROCESSING
--    |
--    v
-- COMPLETED
--
-- Failure:
--
-- PROCESSING
--    |
--    v
-- FAILED
-- ============================================================


-- Enable UUID generation.
--
-- gen_random_uuid() is provided by PostgreSQL's pgcrypto
-- functionality.
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- Orders
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
    -- Unique identifier for the order.
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Name of the customer who placed the order.
    customer_name VARCHAR(255) NOT NULL,

    -- Name or description of the ordered product.
    product VARCHAR(255) NOT NULL,

    -- Number of units ordered.
    quantity INTEGER NOT NULL,

    -- Current state of the order.
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    -- Timestamp when the order was created.
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Timestamp when the order was last updated.
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Quantity must always be a positive number.
    CONSTRAINT orders_quantity_positive
        CHECK (quantity > 0),

    -- Only valid OrderFlow states are allowed.
    CONSTRAINT orders_status_valid
        CHECK (
            status IN (
                'PENDING',
                'PROCESSING',
                'COMPLETED',
                'FAILED'
            )
        )
);


-- ============================================================
-- Indexes
-- ============================================================

-- Orders will commonly be retrieved by creation time.
CREATE INDEX IF NOT EXISTS idx_orders_created_at
    ON orders (created_at DESC);


-- Worker/API operations may need to find orders by status.
CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders (status);
