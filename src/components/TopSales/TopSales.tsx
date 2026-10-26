// src/components/TopSales/TopSales.tsx

import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import type { Product } from '../../types';
import ProductCard from '../ProductCard/ProductCard';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage'; 

export default function TopSales() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTopSales = () => {
    setLoading(true);
    setError(null);
    
    api.getTopSales()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTopSales();
  }, []);

  if (error) {
    return (
      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
        <ErrorMessage onRetry={loadTopSales} />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
        <Loader />
      </section>
    );
  }

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