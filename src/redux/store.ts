import { configureStore } from '@reduxjs/toolkit';

import { sliceReducer } from './slice/slice';

export const store = configureStore({
  reducer: {
    slice: sliceReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type TRootState = ReturnType<typeof store.getState>;

export type TAppDispatch = typeof store.dispatch;
