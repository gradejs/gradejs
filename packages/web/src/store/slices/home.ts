import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { client } from '../../services/apiClient';
import { RootState } from '../';

const parseWebsite = createAsyncThunk('home/submitWebsite', async (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  await client.mutation('requestWebPageRescan', url);
});

const home = createSlice({
  name: 'home',
  initialState: {
    isLoading: false,
    isFailed: false,
    address: '',
    loadError: null as SerializedError | null,
  },
  reducers: {
    resetError(state) {
      state.address = '';
      state.isFailed = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(parseWebsite.pending, (state, action) => {
        state.address = new URL(action.meta.arg).toString();
        state.isLoading = true;
        state.isFailed = false;
        state.loadError = null;
      })
      .addCase(parseWebsite.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(parseWebsite.rejected, (state, action) => {
        state.isFailed = true;
        state.isLoading = false;
        state.loadError = action.error;
      });
  },
});

export const { resetError } = home.actions;
export const defaultSelector = (state: RootState) => state.home;
export const homeReducer = home.reducer;
export { parseWebsite };
