import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { client, GetPackageInfoOutput } from '../../services/apiClient';

export type PackageInfoState = {
  isLoading: boolean;
  error?: SerializedError;
  packageInfo?: GetPackageInfoOutput;
};

export type PackageInfoSlice = Record<string, PackageInfoState>;

export const requestPackageInfo = createAsyncThunk(
  'package/getInfo',
  async ({ packageName }: { packageName: string }) => {
    return client.query('getPackageInfo', { packageName });
  }
);

const packageInfo = createSlice({
  name: 'package',
  initialState: {} as PackageInfoSlice,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPackageInfo.pending, (state, action) => {
        const { packageName } = action.meta.arg;
        const previousPackageState = state[packageName] ?? null;

        state[packageName] = {
          ...previousPackageState,
          packageInfo: undefined,
          error: undefined,
          isLoading: true,
        };
      })
      .addCase(requestPackageInfo.rejected, (state, action) => {
        const { packageName } = action.meta.arg;
        const previousPackageState = state[packageName] ?? null;

        state[packageName] = {
          ...previousPackageState,
          packageInfo: undefined,
          error: action.error,
          isLoading: false,
        };
      })
      .addCase(requestPackageInfo.fulfilled, (state, action) => {
        const { packageName } = action.meta.arg;
        const previousPackageState = state[packageName] ?? null;

        state[packageName] = {
          ...previousPackageState,
          packageInfo: action.payload,
          error: undefined,
          isLoading: false,
        };
      });
  },
});

export const packageReducer = packageInfo.reducer;
