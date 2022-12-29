import type { TRootState } from '../store';

export const getSliceData = (store: TRootState) => {
  return store.slice.data;
};
