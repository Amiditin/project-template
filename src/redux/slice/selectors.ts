import type { RootState } from '../store';

export const getSliceData = (store: RootState) => {
  return store.slice.data;
};
