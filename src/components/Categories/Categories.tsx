import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategoriesRequest } from '../../store/slices/catalogSlice';

interface CategoriesProps {
  activeId: number;
  onSelect: (id: number) => void;
}

export default function Categories({ activeId, onSelect }: CategoriesProps) {
   const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.catalog.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, categories.length]);

  return (
    <ul className="catalog-categories nav justify-content-center">
      <li className="nav-item">
        <a
          className={'nav-link' + (activeId === 0 ? ' active' : '')}
          onClick={(e) => {
            e.preventDefault();
            onSelect(0);
          }}
          href="#"
        >
          Все
        </a>
      </li>

      {categories.map((cat) => (
        <li className="nav-item" key={cat.id}>
          <a
            className={'nav-link' + (activeId === cat.id ? ' active' : '')}
            onClick={(e) => {
              e.preventDefault();
              onSelect(cat.id);
            }}
            href="#"
          >
            {cat.title}
          </a>
        </li>
      ))}
    </ul>
  );
}