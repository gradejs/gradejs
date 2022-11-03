import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { client, GetPackageInfoOutput } from '../../services/apiClient';

export type PackageInfoState = {
  isLoading: boolean;
  isUsageLoading: boolean;
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

export const requestPackageUsage = createAsyncThunk(
  'package/getUsage',
  async ({
    packageName,
    limit,
    offset,
  }: {
    packageName: string;
    limit: number;
    offset: number;
  }) => {
    return client.query('getPackageUsage', { packageName, limit, offset });
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

        state[packageName] = {
          packageInfo: undefined,
          error: undefined,
          isLoading: true,
          isUsageLoading: false,
        };
      })
      .addCase(requestPackageInfo.rejected, (state, action) => {
        const { packageName } = action.meta.arg;

        state[packageName] = {
          packageInfo: undefined,
          error: action.error,
          isLoading: false,
          isUsageLoading: false,
        };
      })
      .addCase(requestPackageInfo.fulfilled, (state, action) => {
        const { packageName } = action.meta.arg;

        state[packageName] = {
          packageInfo: action.payload,
          error: undefined,
          isLoading: false,
          isUsageLoading: false,
        };
      })
      .addCase(requestPackageUsage.pending, (state, action) => {
        const { packageName } = action.meta.arg;

        state[packageName] = {
          ...state[packageName],
          isUsageLoading: true,
        };
      })
      .addCase(requestPackageUsage.rejected, (state, action) => {
        const { packageName } = action.meta.arg;

        state[packageName] = {
          ...state[packageName],
          isUsageLoading: false,
        };
      })
      .addCase(requestPackageUsage.fulfilled, (state, action) => {
        const { packageName } = action.meta.arg;
        const { packageInfo: prevPackageInfo } = state[packageName];

        if (prevPackageInfo) {
          state[packageName] = {
            ...state[packageName],
            packageInfo: {
              ...prevPackageInfo,
              usage: prevPackageInfo.usage.concat(action.payload.usage),
            },
            isUsageLoading: false,
          };
        }
      });
  },
});

export const packageReducer = packageInfo.reducer;
