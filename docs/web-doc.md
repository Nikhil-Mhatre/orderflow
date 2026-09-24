frontend/
├── src/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── globals.css
│ │ │
│ │ ├── products/
│ │ │ ├── page.tsx
│ │ │ └── loading.tsx
│ │ │
│ │ ├── cart/
│ │ │ └── page.tsx
│ │ │
│ │ ├── checkout/
│ │ │ └── page.tsx
│ │ │
│ │ └── orders/
│ │ └── [orderId]/
│ │ ├── page.tsx
│ │ └── loading.tsx
│ │
│ ├── components/
│ │ ├── ui/
│ │ │ └── ...
│ │ │
│ │ ├── layout/
│ │ │ ├── site-header.tsx
│ │ │ └── site-footer.tsx
│ │ │
│ │ ├── products/
│ │ │ ├── product-card.tsx
│ │ │ ├── product-grid.tsx
│ │ │ └── product-price.tsx
│ │ │
│ │ ├── cart/
│ │ │ ├── cart-item.tsx
│ │ │ ├── cart-list.tsx
│ │ │ ├── cart-summary.tsx
│ │ │ └── cart-empty.tsx
│ │ │
│ │ ├── checkout/
│ │ │ ├── checkout-form.tsx
│ │ │ └── checkout-summary.tsx
│ │ │
│ │ └── orders/
│ │ ├── order-summary.tsx
│ │ ├── order-items.tsx
│ │ └── order-status.tsx
│ │
│ ├── providers/
│ │ ├── query-provider.tsx
│ │ └── cart-provider.tsx
│ │
│ ├── hooks/
│ │ ├── use-cart.ts
│ │ ├── use-products.ts
│ │ └── use-order-status.ts
│ │
│ ├── lib/
│ │ ├── api/
│ │ │ ├── client.ts
│ │ │ ├── products.ts
│ │ │ └── orders.ts
│ │ │
│ │ ├── format.ts
│ │ └── utils.ts
│ │
│ ├── schemas/
│ │ └── checkout.schema.ts
│ │
│ └── types/
│ ├── product.ts
│ └── order.ts
│
├── public/
│ └── products/
│
├── components.json
├── eslint.config.ts
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile.dev
├── .dockerignore
├── .gitignore
├── .env.example
└── .env.dev
