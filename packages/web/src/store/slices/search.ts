import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { searchSuggestions, SearchSuggestion } from '../../mocks/SearchSuggestions';

type SearchState = {
  query: string;
  results: SearchSuggestion[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  open: boolean;
  error: null | string;
};

const initialState: SearchState = {
  query: '',
  results: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
  open: false,
  error: null,
};

// TODO: just for the demo purposes
const awaitTimeout = (delay: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const fetchSearchData = createAsyncThunk('search/getData', async (searchInput: string) => {
  // TODO: just for the demo purposes, remove mock request later
  await awaitTimeout(300);
  return {
    query: searchInput,
    results: searchSuggestions,
  };

  // TODO: uncomment to force error
  // eslint-disable-next-line no-promise-executor-return
  // return new Promise((resolve, reject) => reject(new Error(`${searchInput}: yep, error`)));
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
        state.query = action.payload.query;
        state.results = action.payload.results;
      })
      .addCase(fetchSearchData.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Validation error';
        state.results = [];
      });
  },
});

export const searchReducer = search.reducer;
export const { openSearch, closeSearch, resetSearch } = search.actions;
