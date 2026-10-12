import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import type { Product } from '../../types';

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
          <div className="col-4" key={item.id}>
            <div className="card">
              <img
                src={item.images[0]}
                className="card-img-top img-fluid"
                alt={item.title}
              />
              <div className="card-body">
                <p className="card-text">{item.title}</p>
                <p className="card-text">{item.price.toLocaleString('ru-RU')} руб.</p>
                <Link to={`/catalog/${item.id}`} className="btn btn-outline-primary">
                  Заказать
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}