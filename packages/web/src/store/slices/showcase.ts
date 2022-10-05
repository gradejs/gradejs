import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { client, GetShowcaseOutput } from '../../services/apiClient';

export type ShowcaseSlice = {
  isLoading: boolean;
  error?: SerializedError;
  showcase?: GetShowcaseOutput;
};

const fetchShowcaseData = createAsyncThunk('showcase/fetchShowcaseData', async () => {
  return client.query('getShowcase');
});

const showcase = createSlice({
  name: 'showcase',
  initialState: { isLoading: false } as ShowcaseSlice,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowcaseData.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
        state.showcase = undefined;
      })
      .addCase(fetchShowcaseData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchShowcaseData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showcase = action.payload;
      });
  },
});

export const showcaseReducer = showcase.reducer;
export { fetchShowcaseData };
