import { createSlice } from '@reduxjs/toolkit';

import type { TemplateNameState } from './types';

const initialState: TemplateNameState = {};

const templateNameSlice = createSlice({
  name: 'templateName',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const templateNameActions = templateNameSlice.actions;

export const templateNameReducer = templateNameSlice.reducer;
