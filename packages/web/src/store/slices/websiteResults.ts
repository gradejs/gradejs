import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client, GetWebPageScanOutput } from '../../services/apiClient';
import { trackCustomEvent } from '../../services/analytics';

type WebsiteResultsState = {
  filters: {}; // typeof DefaultFiltersAndSorters;
  isFailed: boolean;
  isLoading: boolean;
  detectionResult?: GetWebPageScanOutput;
};

const initialState: WebsiteResultsState = {
  filters: {}, // { ...DefaultFiltersAndSorters },
  isFailed: false,
  isLoading: false,
  detectionResult: undefined,
};

const sleep = (ms: number | undefined) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

const isScanPending = (result: GetWebPageScanOutput) => result?.status === 'pending';

const getScanResults = createAsyncThunk(
  'scanResults/getScanResults',
  async ({ address, useRetry = true }: { address: string; useRetry?: boolean }) => {
    if (!address.startsWith('http://') && !address.startsWith('https://')) {
      address = `https://${address}`;
    }

    const loadStartTime = Date.now();
    let results = await client.query('getWebPageScan', address);
    if (useRetry) {
      while (isScanPending(results)) {
        await sleep(5000);
        results = await client.query('getWebPageScan', address);
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
      state.filters = {
        /*...DefaultFiltersAndSorters*/
      };
    },
    applyFilters(_state) {
      // state.filters = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getScanResults.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
        state.detectionResult = undefined;
      })
      .addCase(getScanResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detectionResult = action.payload;
      })
      .addCase(getScanResults.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      });
  },
});

export type DetectionResult = GetWebPageScanOutput;
export const { resetFilters, applyFilters } = websiteResults.actions;
export { getScanResults };
export const websiteResultsReducer = websiteResults.reducer;
