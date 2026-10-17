import { db, pool } from "../client.js";
import { products } from "../schema/products.js";

const seedProducts = [
  {
    slug: "macbook-pro-14-inch",
    name: "MacBook Pro 14-inch",
    description: "Apple MacBook Pro with a 14-inch Liquid Retina XDR display.",
    price: 199900,
    image: "/products/macbook-pro.png",
    active: true,
  },
  {
    slug: "sony-wh-1000xm6",
    name: "Sony WH-1000XM6",
    description:
      "Wireless noise-cancelling headphones with premium sound quality.",
    price: 44900,
    image: "/products/sony-wh-1000xm6.png",
    active: true,
  },
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    description:
      "Apple iPhone Pro with advanced camera and performance features.",
    price: 134900,
    image: "/products/iphone-17-pro.png",
    active: true,
  },
  {
    slug: "apple-watch-series-11",
    name: "Apple Watch Series 11",
    description:
      "Advanced smartwatch with health, fitness, and connectivity features.",
    price: 46900,
    image: "/products/apple-watch-series-11.png",
    active: true,
  },
  {
    slug: "ipad-pro",
    name: "iPad Pro",
    description:
      "Professional tablet with a high-resolution display and powerful performance.",
    price: 99900,
    image: "/products/ipad-pro.png",
    active: true,
  },
];

async function seed() {
  console.log("Seeding products...");

  for (const product of seedProducts) {
    await db
      .insert(products)
      .values(product)
      .onConflictDoNothing({ target: products.slug });
  }

  console.log(`Processed ${seedProducts.length} products.`);
}

seed()
  .catch((error) => {
    console.error("Product seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
