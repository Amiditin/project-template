import { createSlice } from '@reduxjs/toolkit';
import { SliceState } from './types';
import { getData } from './thunk';

const initialState: SliceState = {
  data: [],
};

const sliceSlice = createSlice({
  name: 'slice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getData.pending, (state) => {
      state.data = [];
    });

    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(getData.rejected, (state) => {
      state.data = [];
    });
  },
});

export const sliceActions = sliceSlice.actions;

export const sliceReducer = sliceSlice.reducer;
