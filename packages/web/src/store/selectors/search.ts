import { RootState } from '../index';

const selectSearchResults = (state: RootState) => state.search.results;

export { selectSearchResults };
