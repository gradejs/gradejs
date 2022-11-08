import { RootState } from '../index';

const selectSearchOpen = (state: RootState) => state.search.open;
const selectSearchResults = (state: RootState) => state.search.results;

export { selectSearchOpen, selectSearchResults };
