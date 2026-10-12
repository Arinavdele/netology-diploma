import { call, put, takeLatest, all } from 'redux-saga/effects';
import { api } from '../../api/api';
import type { Category, Product } from '../../types';
import {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
} from '../slices/catalogSlice';

function* fetchCategoriesWorker(): Generator {
  try {
    const data = (yield call(api.getCategories)) as Category[];
    yield put(fetchCategoriesSuccess(data));
  } catch (err) {
    yield put(
      fetchCategoriesFailure(err instanceof Error ? err.message : 'Ошибка')
    );
  }
}

function* fetchItemsWorker(
  action: ReturnType<typeof fetchItemsRequest>
): Generator {
  const { categoryId, offset, q, reset } = action.payload;

  try {
    const data = (yield call(api.getItems, {
      categoryId: categoryId || undefined,
      offset,
      q: q || undefined,
    })) as Product[];

    yield put(
      fetchItemsSuccess({
        items: data,
        offset: offset + data.length,
        append: !reset,
      })
    );
  } catch (err) {
    yield put(
      fetchItemsFailure(err instanceof Error ? err.message : 'Ошибка')
    );
  }
}

export function* catalogSaga(): Generator {
  yield all([
    takeLatest(fetchCategoriesRequest.type, fetchCategoriesWorker),
    takeLatest(fetchItemsRequest.type, fetchItemsWorker),
  ]);
}