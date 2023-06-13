import { createSlice } from '@reduxjs/toolkit';

import { postsThunks } from './thunk';

import type { IPostsState } from './types';

const initialState: IPostsState = {
  items: [],
  status: 'init',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postsThunks.findAll.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(postsThunks.findAll.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'success';
    });

    builder.addCase(postsThunks.findAll.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { actions: postsActions, reducer: postsReducer, name: postsName } = postsSlice;
