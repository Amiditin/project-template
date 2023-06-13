import { configureStore } from '@reduxjs/toolkit';

import { postsReducer } from './posts';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});
