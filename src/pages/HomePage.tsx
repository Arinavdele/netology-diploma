export default function HomePage() {
  return (
    <>
      <div className="banner">
        <img src="/img/banner.jpg" className="img-fluid" alt="К весне готовы!" />
        <h2 className="banner-header">К весне готовы!</h2>
      </div>

      <section className="top-sales">
        <h2 className="text-center">Хиты продаж!</h2>
      </section>

      <section className="catalog">
        <h2 className="text-center">Каталог</h2>
      </section>
    </>
  );
}