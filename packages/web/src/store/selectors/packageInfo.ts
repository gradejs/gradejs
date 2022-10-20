import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const makeSelectPackageInfo = () =>
  createSelector(
    [(state: RootState) => state.packageInfo, (state: RootState, name: string | undefined) => name],
    (info, name) => (name ? info[name] : undefined)
  );
