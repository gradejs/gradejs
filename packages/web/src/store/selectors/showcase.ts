import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

const selectShowcaseData = createSelector(
  [(state: RootState) => state.showcase],
  (showcase) => showcase
);

export { selectShowcaseData };
