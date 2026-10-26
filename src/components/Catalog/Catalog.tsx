// src/components/Catalog/Catalog.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Categories from '../Categories/Categories';
import ProductCard from '../ProductCard/ProductCard';
import Loader from '../Loader/Loader';          
import ErrorMessage from '../ErrorMessage/ErrorMessage';
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

  const searchQuery = searchParams.get('q') || '';

  const { items, categoryId, offset, hasMore, loading, error } = useAppSelector(
    (state) => state.catalog
  );

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const loadItems = () => {
    dispatch(resetCatalog());
    dispatch(
      fetchItemsRequest({
        categoryId: 0,
        offset: 0,
        q: searchQuery || undefined,
        reset: true,
      })
    );
  };

  useEffect(() => {
    loadItems();
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

  const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
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
        <form className="catalog-search-form form-inline" onSubmit={handleSearchSubmit}>
          <input
            className="form-control"
            placeholder="Поиск"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </form>
      )}

      <Categories activeId={categoryId} onSelect={handleSelectCategory} />

      {error && <ErrorMessage onRetry={loadItems} />}

      {loading && items.length === 0 && <Loader />}

      {!error && (
        <div className="row">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

      {!error && hasMore && items.length > 0 && (
        <div className="text-center mt-4">
          {loading ? (
            <Loader />
          ) : (
            <button className="btn btn-outline-primary" onClick={handleLoadMore}>
              Загрузить ещё
            </button>
          )}
        </div>
      )}
    </section>
  );
}