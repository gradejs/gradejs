import React, { useState, useEffect } from 'react';
import styles from './SidebarCategory.module.scss';
import SidebarCategoryHiddenSearch from '../SidebarCategoryHiddenSearch/SidebarCategoryHiddenSearch';
import SidebarCategoryHeader from './SidebarCategoryHeader';

type GroupItem = {
  group: string;
  children: string[];
};

type Group = {
  [key: string]: GroupItem;
};

type Props = {
  categoryName: string;
  selectedKeywords: string[];
  keywordsList: string[];
  selectHandler: (selectedKeywords: string[]) => void;
  itemsWithImage?: boolean;
  searchOpen?: boolean;
  returnButton?: () => void;
  resetGroup?: () => void;
  children?: React.ReactNode;
};

export default function SidebarCategoryWithSearch({
  categoryName,
  selectedKeywords,
  keywordsList,
  selectHandler,
  itemsWithImage,
  searchOpen = false,
  returnButton,
  resetGroup,
  children,
}: Props) {
  const [open, setOpen] = useState<boolean>(searchOpen);
  const [searchValue, setSearchValue] = useState<string>('');
  const [list, setList] = useState<GroupItem[]>([]);

  const sortAndGroupList = (unorderedList: string[], value: string): GroupItem[] => {
    const filteredList = unorderedList.filter((item) => item.includes(value));
    const sortedList = filteredList.sort((a: string, b: string) => a.localeCompare(b));

    const groups = sortedList.reduce((r: Group, e) => {
      const group = e.includes('#') ? e[1] : e[0];
      if (!r[group]) r[group] = { group, children: [e] };
      else r[group].children.push(e);
      return r;
    }, {});

    return Object.values(groups);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const searchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearInput = () => {
    setSearchValue('');
  };

  useEffect(() => {
    const filteredList = sortAndGroupList(keywordsList, searchValue);
    setList(filteredList);
  }, [searchValue]);

  return (
    <>
      <SidebarCategoryHeader
        returnButton={returnButton}
        categoryName={categoryName}
        selectedKeywords={selectedKeywords}
        resetGroup={resetGroup}
      />

      {open ? (
        <SidebarCategoryHiddenSearch
          searchValue={searchValue}
          selectHandler={selectHandler}
          searchChangeHandler={searchChangeHandler}
          itemsWithImage={itemsWithImage}
          clearInput={clearInput}
          selectedItems={selectedKeywords}
          alphabeticalGroups={list}
        />
      ) : (
        children
      )}

      <span role='button' className={styles.toggleView} onClick={toggleOpen}>
        {open ? 'Hide' : 'View All'}
      </span>
    </>
  );
}
