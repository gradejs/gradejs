import React from 'react';
import SidebarCategoryHeader from './SidebarCategoryHeader';
import Search from '../Search/Search';

type Props = {
  categoryName: string;
  searchValue: string;
  handleSearchTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchInput: () => void;
};

export default function SidebarCategorySearch({
  categoryName,
  searchValue,
  handleSearchTextChange,
  clearSearchInput,
}: Props) {
  return (
    <>
      <SidebarCategoryHeader categoryName={categoryName} />

      <Search
        searchValue={searchValue}
        placeholder='Name'
        searchChangeHandler={handleSearchTextChange}
        clearInput={clearSearchInput}
      />
    </>
  );
}
