import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const getData = createAsyncThunk<any[]>('slice/getData', async () => {
  const { data } = await axios.get('/auth/user');

  return data;
});
