import { configureStore } from '@reduxjs/toolkit';

import { sliceReducer } from './slice/slice';

export const store = configureStore({
  reducer: {
    slice: sliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
