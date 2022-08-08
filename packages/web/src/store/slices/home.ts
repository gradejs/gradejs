import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../services/apiClient';
import { RootState } from '../';

const parseWebsite = createAsyncThunk('home/submitWebsite', async (url: string) => {
  await client.mutation('requestParseWebsite', url);
});

const home = createSlice({
  name: 'home',
  initialState: {
    isLoading: false,
    isFailed: false,
    hostname: '',
  },
  reducers: {
    resetError(state) {
      state.hostname = '';
      state.isFailed = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(parseWebsite.pending, (state, action) => {
        state.hostname = new URL(action.meta.arg).hostname;
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(parseWebsite.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(parseWebsite.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      });
  },
});

export const { resetError } = home.actions;
export const defaultSelector = (state: RootState) => state.home;
export const homeReducer = home.reducer;
export { parseWebsite };
