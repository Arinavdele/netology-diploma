// src/pages/ProductPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import type { ProductDetails } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart, updatePrice } from '../store/slices/cartSlice';
import Loader from '../components/Loader/Loader';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const cartItems = useAppSelector((state) => state.cart.items);

  const loadProduct = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api.getItem(Number(id))
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage onRetry={loadProduct} />;
  if (!product) return <div className="text-center my-5">Товар не найден</div>;

  const availableSizes = product.sizes.filter((s) => s.available);
  const hasSizes = availableSizes.length > 0;

  const cartItem = cartItems.find((item) => item.id === product.id);
  const isPriceChanged = Boolean(cartItem && cartItem.price !== product.price);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        size: selectedSize,
        price: product.price,
        count: quantity,
      })
    );
    navigate('/cart');
  };

  const handleUpdatePrice = () => {
    if (!product || !cartItem) return;
    
    cartItems
      .filter((item) => item.id === product.id)
      .forEach((item) => {
        dispatch(
          updatePrice({ 
            id: product.id, 
            size: item.size, 
            newPrice: product.price 
          })
        );
      });
  };

  return (
    <section className="catalog-item">
      <h2 className="text-center">{product.title}</h2>
      <div className="row">
        {/* Левая колонка: картинка */}
        <div className="col-5">
          <img
            src={product.images[0]}
            className="img-fluid"
            alt={product.title}
          />
        </div>

        {/* Правая колонка: таблица */}
        <div className="col-7">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Артикул</td>
                <td>{product.sku || '-'}</td>
              </tr>
              <tr>
                <td>Производитель</td>
                <td>{product.manufacturer || '-'}</td>
              </tr>
              <tr>
                <td>Цвет</td>
                <td>{product.color || '-'}</td>
              </tr>
              <tr>
                <td>Материалы</td>
                <td>{product.material || '-'}</td>
              </tr>
              <tr>
                <td>Сезон</td>
                <td>{product.season || '-'}</td>
              </tr>
              <tr>
                <td>Повод</td>
                <td>{product.reason || '-'}</td>
              </tr>
            </tbody>
          </table>

          {hasSizes ? (
            <div className="text-center">
              <p>
                Размеры в наличии:{' '}
                {availableSizes.map((s) => (
                  <span
                    key={s.size}
                    className={`catalog-item-size ${
                      selectedSize === s.size ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedSize(s.size)}
                    style={{ cursor: 'pointer' }}
                  >
                    {s.size}
                  </span>
                ))}
              </p>

              <p>
                Количество:{' '}
                <span className="btn-group btn-group-sm pl-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="btn btn-outline-primary">{quantity}</span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  >
                    +
                  </button>
                </span>
              </p>
            </div>
          ) : (
            <p className="text-center text-danger">Нет в наличии</p>
          )}

          {isPriceChanged && cartItem && (
            <div className="alert alert-warning d-flex justify-content-between align-items-center mt-3">
              <span>
                Цена изменилась! В корзине: <b>{cartItem.price} ₽</b>, сейчас: <b>{product.price} ₽</b>
              </span>
              <button 
                className="btn btn-sm btn-outline-dark" 
                onClick={handleUpdatePrice}
              >
                Обновить цену
              </button>
            </div>
          )}

          {hasSizes && (
            <button
              className="btn btn-danger btn-block btn-lg mt-3"
              disabled={!selectedSize}
              onClick={handleAddToCart}
            >
              В корзину
            </button>
          )}
        </div>
      </div>
    </section>
  );
}