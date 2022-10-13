import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { ScanResultPackageWithMetadata } from '@gradejs-public/public-api/src/clientApiRouter';
import SidebarCategoryHeader from './SidebarCategoryHeader';
import Search from '../Search/Search';
import { SearchText } from 'store/slices/scanDisplayOptions';

type Props = {
  categoryName: string;
  packages: ScanResultPackageWithMetadata[] | undefined;
  searchText: SearchText;
  handleSearchTextChange: (newSearchText: SearchText) => void;
};

export default function SidebarCategorySearch({
  categoryName,
  searchText,
  handleSearchTextChange,
}: Props) {
  const [searchValue, setSearchValue] = useState<string>(searchText);

  const searchChangeHandler = (inputValue: string) => {
    handleSearchTextChange(inputValue);
  };

  const debouncedChangeHandler = useCallback(debounce(searchChangeHandler, 250), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedChangeHandler(e.target.value);
  };

  const clearInput = () => {
    setSearchValue('');
    handleSearchTextChange('');
  };

  return (
    <>
      <SidebarCategoryHeader categoryName={categoryName} />

      <Search
        searchValue={searchValue}
        placeholder='Name'
        searchChangeHandler={handleChange}
        clearInput={clearInput}
      />
    </>
  );
}
