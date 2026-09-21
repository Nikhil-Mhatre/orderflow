// Export database schemas from a single entry point.
//
// Consumers such as Drizzle can import the complete schema without knowing
// which individual files contain each table definition.

export * from "./orders.js";
