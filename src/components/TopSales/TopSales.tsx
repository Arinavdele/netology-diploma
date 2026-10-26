import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import type { Product } from '../../types';
import ProductCard from '../ProductCard/ProductCard';

export default function TopSales() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    api.getTopSales().then(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="top-sales">
      <h2 className="text-center">Хиты продаж!</h2>
      <div className="row">
          {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}