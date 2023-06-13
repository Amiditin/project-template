import { createSelector } from '@reduxjs/toolkit';

import type { TRootState } from '@/redux/types';

const getPosts = (state: TRootState) => state.posts;

export const getPostsItems = createSelector(getPosts, (posts) => {
  return posts.items;
});

export const getPostsStatus = createSelector(getPosts, (posts) => {
  return posts.status;
});
