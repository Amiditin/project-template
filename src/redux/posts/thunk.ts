import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { postsService } from '@/shared/api/services';

import { postsName } from './slice';

import type { IPostModel } from '@/shared/api/models';
import type { TThunkConfig } from '@/redux/types';
import type { TPostCreate, TPostUpdate } from '@/shared/api/services/posts/types';

const getAllItems = async () => {
  const { data } = await postsService.findAll();

  return data;
};

export const postsThunks = {
  findAll: createAsyncThunk<IPostModel[], undefined, TThunkConfig>(
    `${postsName}/findAll`,
    async (_, { rejectWithValue }) => {
      try {
        return await getAllItems();
      } catch (error) {
        return rejectWithValue(error as AxiosError);
      }
    },
  ),

  create: createAsyncThunk<IPostModel[], TPostCreate, TThunkConfig>(
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

  update: createAsyncThunk<IPostModel[], TPostUpdate, TThunkConfig>(
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

  remove: createAsyncThunk<IPostModel[], { id: string }, TThunkConfig>(
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
