import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectPackageInfo = createSelector(
  [(state: RootState) => state.packageInfo],
  (info) => info
);
