import { AxiosError } from 'axios';

import { postsService } from '@/shared/api/services';
import { createAppThunk } from '@/redux/utils';

import { postsName } from './slice';

import type { IPostModel } from '@/shared/api/models';
import type { TPostCreate, TPostUpdate } from '@/shared/api/services/posts/types';

const getAllItems = async () => {
  const { data } = await postsService.findAll();

  return data;
};

export const postsThunks = {
  findAll: createAppThunk<IPostModel[]>(`${postsName}/findAll`, async (_, { rejectWithValue }) => {
    try {
      return await getAllItems();
    } catch (error) {
      return rejectWithValue(error as AxiosError);
    }
  }),

  create: createAppThunk<IPostModel[], TPostCreate>(
    `${postsName}/create`,
    async (params, { rejectWithValue }) => {
      try {
        await postsService.create(params);

        return getAllItems();
      } catch (error) {
        return rejectWithValue(error as AxiosError);
      }
    },
  ),

  update: createAppThunk<IPostModel[], TPostUpdate>(
    `${postsName}/update`,
    async (params, { rejectWithValue }) => {
      try {
        await postsService.update(params);

        return getAllItems();
      } catch (error) {
        return rejectWithValue(error as AxiosError);
      }
    },
  ),

  remove: createAppThunk<IPostModel[], { id: string }>(
    `${postsName}/remove`,
    async (params, { rejectWithValue }) => {
      try {
        await postsService.remove(params);

        return getAllItems();
      } catch (error) {
        return rejectWithValue(error as AxiosError);
      }
    },
  ),
};
