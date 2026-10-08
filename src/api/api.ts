import type {
  Category,
  Product,
  ProductDetails,
  OrderData,
} from '../types';

const API_URL = 'http://localhost:7070/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTopSales: (): Promise<Product[]> =>
    request<Product[]>(`${API_URL}/top-sales`),

  getCategories: (): Promise<Category[]> =>
    request<Category[]>(`${API_URL}/categories`),

  getItems: (params: {
    categoryId?: number;
    offset?: number;
    q?: string;
  }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params.categoryId) query.set('categoryId', String(params.categoryId));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.q) query.set('q', params.q);

    return request<Product[]>(`${API_URL}/items?${query.toString()}`);
  },

  getItem: (id: number): Promise<ProductDetails> =>
    request<ProductDetails>(`${API_URL}/items/${id}`),

  postOrder: (data: OrderData): Promise<void> =>
    request<void>(`${API_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};