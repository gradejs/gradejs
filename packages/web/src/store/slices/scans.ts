import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { client, GetOrRequestWebPageRescanOutput } from '../../services/apiClient';

export type ScanResultsState = {
  isLoading: boolean;
  error?: SerializedError;
  scan?: GetOrRequestWebPageRescanOutput;
};

export type ScanResultsSlice = Record<string, ScanResultsState>;

const requestWebPageScan = createAsyncThunk(
  'scans/requestWebPageScan',
  async ({ normalizedUrl, rescan = false }: { normalizedUrl: string; rescan?: boolean }) => {
    return client.mutation('getOrRequestWebPageScan', { url: normalizedUrl, rescan });
  }
);

const scans = createSlice({
  name: 'scans',
  initialState: {} as ScanResultsSlice,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestWebPageScan.pending, (state, action) => {
        const { normalizedUrl } = action.meta.arg;

        const previousScanState = state[normalizedUrl] ?? null;

        state[normalizedUrl] = {
          ...previousScanState,
          isLoading: true,
          error: undefined,
          scan: undefined,
        };
      })
      .addCase(requestWebPageScan.rejected, (state, action) => {
        const { normalizedUrl } = action.meta.arg;

        const previousScanState = state[normalizedUrl] ?? null;

        state[normalizedUrl] = {
          ...previousScanState,
          isLoading: false,
          error: action.error,
          scan: undefined,
        };
      })
      .addCase(requestWebPageScan.fulfilled, (state, action) => {
        const { normalizedUrl } = action.meta.arg;

        const previousScanState = state[normalizedUrl] ?? null;

        state[normalizedUrl] = {
          ...previousScanState,
          isLoading: false,
          error: undefined,
          scan: action.payload,
        };
      });
  },
});

export const scansReducer = scans.reducer;
export { requestWebPageScan };
