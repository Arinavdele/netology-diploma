import { all } from 'redux-saga/effects';
import { catalogSaga } from './catalogSaga';

export function* rootSaga(): Generator {
  yield all([catalogSaga()]);
}