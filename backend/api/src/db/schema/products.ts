import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  /**
   * Unique product identifier.
   *
   * PostgreSQL generates the UUID automatically.
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * Product name displayed to customers.
   */
  name: text("name").notNull(),

  /**
   * Product description.
   */
  description: text("description").notNull(),

  /**
   * Product price stored in the smallest currency unit.
   *
   * Example:
   * $1,999.00 = 199900
   */
  price: integer("price").notNull(),

  /**
   * Product image URL/path.
   */
  image: text("image").notNull(),

  /**
   * Determines whether the product can currently be ordered.
   */
  active: boolean("active").notNull().default(true),

  /**
   * Timestamp when the product was created.
   */
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  /**
   * Timestamp when the product was last updated.
   */
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
