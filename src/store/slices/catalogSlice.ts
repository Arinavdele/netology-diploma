import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category, Product } from '../../types';

interface CatalogState {
  categories: Category[];
  items: Product[];
  categoryId: number;   // 0 = «Все»
  offset: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  categories: [],
  items: [],
  categoryId: 0,
  offset: 0,
  hasMore: true,
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {

    fetchCategoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchItemsRequest(
      state,
      action: PayloadAction<{ categoryId: number; offset: number; q?: string; reset?: boolean }>
    ) {
      state.loading = true;
      state.error = null;

      // Сброс перед новой загрузкой
      if (action.payload.reset) {
        state.items = [];
        state.offset = 0;
      }

      state.categoryId = action.payload.categoryId;
    },
    fetchItemsSuccess(
      state,
      action: PayloadAction<{ items: Product[]; offset: number; append: boolean }>
    ) {
      if (action.payload.append) {
        state.items = [...state.items, ...action.payload.items];
      } else {
        state.items = action.payload.items;
      }
      state.offset = action.payload.offset;
      state.hasMore = action.payload.items.length === 6;
      state.loading = false;
    },
    fetchItemsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    resetCatalog(state) {
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
      state.error = null;
      state.categoryId = 0;
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  resetCatalog,
} = catalogSlice.actions;

export const catalogReducer = catalogSlice.reducer;