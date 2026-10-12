import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Categories from '../Categories/Categories';
import ProductCard from '../ProductCard/ProductCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchItemsRequest,
  resetCatalog,
} from '../../store/slices/catalogSlice';

interface CatalogProps {
  showSearch?: boolean;
}

export default function Catalog({ showSearch = false }: CatalogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Берём q из URL
  const searchQuery = searchParams.get('q') || '';

  const { items, categoryId, offset, hasMore } = useAppSelector(
    (state) => state.catalog
  );

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(resetCatalog());
    dispatch(
      fetchItemsRequest({
        categoryId: 0,
        offset: 0,
        q: searchQuery || undefined,
        reset: true,
      })
    );
  }, [dispatch, searchQuery]);

  const handleSelectCategory = (id: number) => {
    dispatch(resetCatalog());
    dispatch(
      fetchItemsRequest({
        categoryId: id,
        offset: 0,
        q: searchQuery || undefined,
        reset: true,
      })
    );
  };

  const handleLoadMore = () => {
    dispatch(
      fetchItemsRequest({
        categoryId,
        offset,
        q: searchQuery || undefined,
        reset: false,
      })
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localSearch.trim();

    if (trimmed) {
      navigate(`/catalog?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>

      {showSearch && (
        <form
          className="catalog-search-form form-inline"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control"
            placeholder="Поиск"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </form>
      )}

      <Categories activeId={categoryId} onSelect={handleSelectCategory} />

      <div className="row">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {hasMore && items.length > 0 && (
        <div className="text-center">
          <button className="btn btn-outline-primary" onClick={handleLoadMore}>
            Загрузить ещё
          </button>
        </div>
      )}
    </section>
  );
}