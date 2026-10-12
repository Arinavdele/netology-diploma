import TopSales from "../components/TopSales/TopSales";
import Catalog from '../components/Catalog/Catalog';

export default function HomePage() {
  return (
    <>
      <div className="banner">
        <img src="/img/banner.jpg" className="img-fluid" alt="К весне готовы!" />
        <h2 className="banner-header">К весе готовы!</h2>
      </div>

      <TopSales />

      <Catalog />
    </>
  );
}