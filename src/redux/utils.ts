import {
  createAsyncThunk,
  type AsyncThunkOptions,
  type AsyncThunkPayloadCreator,
} from '@reduxjs/toolkit';

import type { IAppThunkConfig } from './types';

export const createAppThunk = <Returned, ThunkArg = void>(
  type: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, IAppThunkConfig>,
  options?: AsyncThunkOptions<ThunkArg, IAppThunkConfig>,
) => {
  return createAsyncThunk(type, payloadCreator, options);
};
