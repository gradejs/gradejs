import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PackageTrait = 'vulnerable' | 'outdated';

export type PackageFilters = {
  searchText?: string;
  keywords: string[];
  authors: string[];
  traits: PackageTrait[];
};

export type PackageSortType = 'name' | 'size' | 'severity' | 'popularity';
export type PackageSorters = {
  by: PackageSortType;
  direction: 'ASC' | 'DESC';
};

export type ScanDisplayOptions = {
  packageFilters: PackageFilters;
  packageSorters: PackageSorters[];
};

export type ScanDisplayOptionsSlice = Record<string, ScanDisplayOptions | undefined>;

const initialState: ScanDisplayOptionsSlice = {};

const scanDisplayOptions = createSlice({
  name: 'scanDisplayOptions',
  initialState,
  reducers: {
    setScanDisplayOptions(
      state,
      action: PayloadAction<{ scanUrl: string; options: ScanDisplayOptions }>
    ) {
      state[action.payload.scanUrl] = action.payload.options;
    },
    resetScanDisplayOptions(state, action: PayloadAction<{ scanUrl: string }>) {
      state[action.payload.scanUrl] = undefined;
    },
  },
});

export const scanDisplayOptionsReducer = scanDisplayOptions.reducer;
export const { setScanDisplayOptions, resetScanDisplayOptions } = scanDisplayOptions.actions;
