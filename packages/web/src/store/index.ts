import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { scansReducer } from './slices/scans';
import { showcaseReducer } from './slices/showcase';
import { scanDisplayOptionsReducer } from './slices/scanDisplayOptions';
import { packageReducer } from './slices/package';

export const createApplicationStore = (
  extraMiddleware: Middleware[] = [],
  preloadedState: object = {}
) =>
  configureStore({
    middleware: (getDefaultMiddleware) =>
      // TODO: Typescript is the definition of bringing the worst with the best intentions
      getDefaultMiddleware().prepend(extraMiddleware) as ReturnType<typeof getDefaultMiddleware>,
    reducer: {
      showcase: showcaseReducer,
      scans: scansReducer,
      packageInfo: packageReducer,
      scanDisplayOptions: scanDisplayOptionsReducer,
    },
    preloadedState,
  });

export type AppStore = ReturnType<typeof createApplicationStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { selectors as websiteResultsSelectors } from './selectors/websiteResults';
