import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { apiRoutes } from '@/services/apiRoutes';
import { getDataRequest } from '@/services/dataService';

export const getData = createAsyncThunk<any[]>(apiRoutes.DATA, async () => {
  try {
    const { data } = await getDataRequest();

    return data;
  } catch (error) {
    return error as AxiosError;
  }
});
