import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { client, GetPackageInfoOutput } from '../../services/apiClient';

export type PackageInfoSlice = {
  isLoading: boolean;
  error?: SerializedError;
  packageInfo?: GetPackageInfoOutput;
};

export const requestPackageInfo = createAsyncThunk(
  'package/getInfo',
  async ({ packageName }: { packageName: string }) => {
    return client.query('getPackageInfo', { packageName });
  }
);

const packageInfo = createSlice({
  name: 'package',
  initialState: { isLoading: false } as PackageInfoSlice,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPackageInfo.pending, (state) => {
        state.packageInfo = undefined;
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(requestPackageInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(requestPackageInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packageInfo = action.payload;
      });
  },
});

export const packageReducer = packageInfo.reducer;
