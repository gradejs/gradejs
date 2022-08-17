import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WebPage, WebPagePackage, PackageVulnerabilityData } from '@gradejs-public/shared';
import { DefaultFiltersAndSorters, FiltersState } from '../../components/layouts/Filters/Filters';
import { client } from '../../services/apiClient';
import { trackCustomEvent } from '../../services/analytics';

const defaultDetectionResult = {
  packages: [] as WebPagePackage[],
  vulnerabilities: {} as Record<string, PackageVulnerabilityData[]>,
  webpages: [] as WebPage[],
};

const initialState = {
  filters: { ...DefaultFiltersAndSorters },
  isFailed: false,
  isLoading: false,
  detectionResult: defaultDetectionResult,
};

const sleep = (ms: number | undefined) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

const hasPendingPages = (result: DetectionResult) =>
  !!result.webpages.find((item) => item.status === 'pending');

const getWebsite = createAsyncThunk('websiteResults/getWebsite', async (hostname: string) => {
  const loadStartTime = Date.now();
  let results = await client.mutation('syncWebsite', hostname);
  while (hasPendingPages(results)) {
    await sleep(5000);
    results = await client.mutation('syncWebsite', hostname);
  }
  // TODO: not sure if this should be here
  trackCustomEvent('HostnamePage', 'WebsiteLoaded', {
    value: Date.now() - loadStartTime,
  });
  return results;
});

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

export type DetectionResult = typeof defaultDetectionResult;
export const { resetFilters, applyFilters } = websiteResults.actions;
export { getWebsite };
export const websiteResultsReducer = websiteResults.reducer;
