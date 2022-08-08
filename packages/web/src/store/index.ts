import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { homeReducer } from './slices/home';
import { websiteResultsReducer } from './slices/websiteResults';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    webpageResults: websiteResultsReducer,
  },
  preloadedState: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { parseWebsite, resetError, defaultSelector as homeDefaultSelector } from './slices/home';
export { applyFilters, getWebsite } from './slices/websiteResults';
export { selectors as websiteResultsSelectors } from './selectors/websiteResults';
