// frontend/src/data/products.ts

/**
 * Represents a product available in the OrderFlow storefront.
 *
 * Product data is intentionally owned by the frontend for now.
 * The backend does not need a product catalog or product API.
 */
export interface Product {
  /**
   * Stable frontend identifier.
   *
   * This is used internally by the frontend and should not be
   * confused with an order ID.
   */
  id: string;

  /**
   * Product name displayed to the user.
   *
   * This is also the value that will be sent to order-api
   * when creating an order.
   */
  name: string;

  /**
   * Short description displayed on the product card.
   */
  description: string;

  /**
   * Product price in USD.
   */
  price: number;

  /**
   * Path to the product image under /public.
   */
  image: string;

  /**
   * Product category used for future filtering/grouping.
   */
  category: string;
}

/**
 * Predefined products available in the OrderFlow storefront.
 *
 * This catalog is intentionally static. We can replace it with
 * a backend product service later if the application requires one.
 */
export const products: Product[] = [
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    description: "Professional laptop for demanding workflows.",
    price: 1999,
    image: "/products/macbook-pro.jpg",
    category: "Laptops",
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    description:
      "High-performance smartphone with a professional camera system.",
    price: 1199,
    image: "/products/iphone-17-pro.jpg",
    category: "Smartphones",
  },
  {
    id: "sony-wh-1000xm6",
    name: "Sony WH-1000XM6",
    description: "Premium wireless headphones with active noise cancellation.",
    price: 449,
    image: "/products/sony-wh-1000xm6.jpg",
    category: "Audio",
  },
  {
    id: "mechanical-keyboard",
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard designed for productivity.",
    price: 149,
    image: "/products/mechanical-keyboard.jpg",
    category: "Accessories",
  },
  {
    id: "dell-4k-monitor",
    name: "Dell 4K Monitor",
    description: "27-inch 4K display for productivity and creative work.",
    price: 499,
    image: "/products/dell-4k-monitor.jpg",
    category: "Monitors",
  },
  {
    id: "logitech-mx-master",
    name: "Logitech MX Master",
    description: "Advanced wireless mouse designed for productivity.",
    price: 99,
    image: "/products/logitech-mx-master.jpg",
    category: "Accessories",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    description: "Lightweight tablet for work, entertainment, and creativity.",
    price: 599,
    image: "/products/ipad-air.jpg",
    category: "Tablets",
  },
  {
    id: "usb-c-dock",
    name: "USB-C Dock",
    description: "Multi-port docking station for modern workstations.",
    price: 129,
    image: "/products/usb-c-dock.jpg",
    category: "Accessories",
  },
];
