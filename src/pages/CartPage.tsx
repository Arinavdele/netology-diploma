// src/pages/CartPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { api } from '../api/api';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // Состояния формы
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Общ сумма
  const totalSum = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  // Удаление товара
  const handleRemove = (id: number, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  // Отправка заказа
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone.trim() || !address.trim() || !agreement) {
      alert('Заполните все поля и согласитесь с правилами!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const orderData = {
      owner: { phone: phone.trim(), address: address.trim() },
      items: cartItems.map((item) => ({
        id: item.id,
        price: item.price,
        count: item.count,
      })),
    };

    api
      .postOrder(orderData)
      .then(() => {
        dispatch(clearCart());
        setSuccess(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Ошибка при оформлении заказа');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Если заказ успешно оформлен
  if (success) {
    return (
      <section className="cart">
        <h2 className="text-center text-success">Заказ успешно оформлен!</h2>
        <p className="text-center">Спасибо за покупку. Мы свяжемся с вами.</p>
        <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline-primary">
            Вернуться на главную
          </Link>
        </div>
      </section>
    );
  }

  // Если корзина пуста
  if (cartItems.length === 0) {
    return (
      <section className="cart">
        <h2 className="text-center">Корзина</h2>
        <p className="text-center">Ваша корзина пуста.</p>
        <div className="text-center mt-4">
          <Link to="/catalog" className="btn btn-outline-primary">
            Перейти в каталог
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="cart">
        <h2 className="text-center">Корзина</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Название</th>
              <th scope="col">Размер</th>
              <th scope="col">Кол-во</th>
              <th scope="col">Стоимость</th>
              <th scope="col">Итого</th>
              <th scope="col">Действия</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={`${item.id}-${item.size}`}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/catalog/${item.id}`}>{item.title}</Link>
                </td>
                <td>{item.size}</td>
                <td>{item.count}</td>
                <td>{item.price.toLocaleString('ru-RU')} руб.</td>
                <td>{(item.price * item.count).toLocaleString('ru-RU')} руб.</td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(item.id, item.size)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} className="text-right font-weight-bold">
                Общая стоимость
              </td>
              <td colSpan={2} className="font-weight-bold">
                {totalSum.toLocaleString('ru-RU')} руб.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="order">
        <h2 className="text-center">Оформить заказ</h2>
        <div className="card" style={{ maxWidth: '30rem', margin: '0 auto' }}>
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                className="form-control"
                id="phone"
                placeholder="Ваш телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Адрес доставки</label>
              <input
                className="form-control"
                id="address"
                placeholder="Адрес доставки"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                disabled={isSubmitting}
              />
              <label className="form-check-label" htmlFor="agreement">
                Согласен с правилами доставки
              </label>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <button 
              type="submit" 
              className="btn btn-outline-secondary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Оформить'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}