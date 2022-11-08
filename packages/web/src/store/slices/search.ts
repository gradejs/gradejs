import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../services/apiClient';

export type SearchSuggestion = {
  type: string;
  hostname?: string;
  name?: string;
  packageCount: number | null;
  path: string;
  description?: string;
};

type SearchState = {
  query: string;
  results: SearchSuggestion[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  open: boolean;
};

const initialState: SearchState = {
  query: '',
  results: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
  open: false,
};

export const fetchSearchData = createAsyncThunk('search/getData', async (searchInput: string) => {
  return client.query('search', searchInput);
});

const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    openSearch: (state) => {
      state.open = true;
    },
    closeSearch: (state) => {
      state.open = false;
    },
    resetSearch: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSearchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.query = action.meta.arg;

        if (action.payload.length) {
          state.results = action.payload.map(
            // @ts-expect-error
            ({ type, hostname, name, packageCount, path, description }) => {
              return {
                type,
                name,
                hostname,
                packageCount,
                path,
                description,
              };
            }
          );
        } else {
          state.results = [];
        }
      })
      .addCase(fetchSearchData.rejected, (state) => {
        state.status = 'failed';
        state.results = [];
      });
  },
});

export const searchReducer = search.reducer;
export const { openSearch, closeSearch, resetSearch } = search.actions;
