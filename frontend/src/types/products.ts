export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
}
