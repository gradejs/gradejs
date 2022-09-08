import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DefaultFiltersAndSorters, FiltersState } from '../../components/layouts/Filters/Filters';
import { client, RequestWebPageScanOutput } from '../../services/apiClient';
import { trackCustomEvent } from '../../services/analytics';

type WebsiteResultsState = {
  filters: typeof DefaultFiltersAndSorters;
  isFailed: boolean;
  isLoading: boolean;
  detectionResult?: RequestWebPageScanOutput;
};

const initialState: WebsiteResultsState = {
  filters: { ...DefaultFiltersAndSorters },
  isFailed: false,
  isLoading: false,
  detectionResult: undefined,
};

const sleep = (ms: number | undefined) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

const isScanPending = (result: DetectionResult) => result && result.status === 'pending';

const getWebsite = createAsyncThunk(
  'websiteResults/getWebsite',
  async ({ hostname, useRetry = true }: { hostname: string; useRetry?: boolean }) => {
    const loadStartTime = Date.now();
    let results = await client.mutation('requestWebPageScan', hostname);
    if (useRetry) {
      while (isScanPending(results)) {
        await sleep(5000);
        results = await client.mutation('requestWebPageScan', hostname);
      }
    }
    // TODO: move to tracking middleware?
    trackCustomEvent('HostnamePage', 'WebsiteLoaded', {
      value: Date.now() - loadStartTime,
    });
    return results;
  }
);

const websiteResults = createSlice({
  name: 'websiteResults',
  initialState,
  reducers: {
    resetFilters(state) {
      state.filters = { ...DefaultFiltersAndSorters };
    },
    applyFilters(state, action: PayloadAction<FiltersState>) {
      state.filters = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getWebsite.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
        state.detectionResult = undefined;
      })
      .addCase(getWebsite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detectionResult = action.payload;
      })
      .addCase(getWebsite.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      });
  },
});

export type DetectionResult = RequestWebPageScanOutput | undefined;
export const { resetFilters, applyFilters } = websiteResults.actions;
export { getWebsite };
export const websiteResultsReducer = websiteResults.reducer;
