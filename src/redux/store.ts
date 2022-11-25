import { configureStore } from '@reduxjs/toolkit';

import { sliceReducer } from './slice/slice';

const store = configureStore({
  reducer: {
    sliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
