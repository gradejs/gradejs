import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { scansReducer } from './slices/scans';
import { showcaseReducer } from './slices/showcase';
import { scanDisplayOptionsReducer } from './slices/scanDisplayOptions';

export const store = configureStore({
  reducer: {
    showcase: showcaseReducer,
    scans: scansReducer,
    scanDisplayOptions: scanDisplayOptionsReducer,
  },
  preloadedState: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { selectors as websiteResultsSelectors } from './selectors/websiteResults';
