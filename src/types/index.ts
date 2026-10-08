export interface Category {
  id: number;
  title: string;
}

export interface Product {
  id: number;
  category: number;
  title: string;
  price: number;
  images: string[];
}

export interface ProductSize {
  size: string;
  available: boolean;
}

export interface ProductDetails extends Product {
  sku: string;
  manufacturer: string;
  color: string;
  material: string;
  reason: string;
  season: string;
  heelSize: string;
  oldPrice?: number;
  sizes: ProductSize[];
}

export interface CartItem {
  id: number;
  title: string;
  size: string;
  price: number;
  count: number;
}

export interface OrderOwner {
  phone: string;
  address: string;
}

export interface OrderData {
  owner: OrderOwner;
  items: Array<{ id: number; price: number; count: number }>;
}