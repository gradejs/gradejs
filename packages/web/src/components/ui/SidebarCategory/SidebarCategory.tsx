import React, { useState, useEffect } from 'react';
import styles from './SidebarCategory.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';
import Badge from '../Badge/Badge';
import Chip from '../Chip/Chip';
import Person from '../Person/Person';
import Checkbox from '../Checkbox/Checkbox';
import SidebarCategorySearch from '../SidebarCategorySearch/SidebarCategorySearch';

type GroupItem = {
  group: string;
  children: string[];
};

type Group = {
  [key: string]: GroupItem;
};

type Props = {
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (name: string) => void;
  renderComponent: 'chip' | 'checkbox' | 'person';
  searchable?: boolean;
};

export default function SidebarCategory({
  keywordsList,
  selectedKeywords,
  selectHandler,
  renderComponent,
  searchable,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
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

  let combinedList, chips, checkboxes, people;
  if (searchable) {
    // FIXME: not sure that this is optimal UX, because when we're selecting item from featured list,
    // it jumps to first half of the list with other previously selected items, maybe it's fine though
    combinedList = [...new Set([...selectedKeywords, ...keywordsList])];

    useEffect(() => {
      const filteredList = sortAndGroupList(keywordsList, searchValue);
      setList(filteredList);
    }, [searchValue]);

    // Show only first 6 element from list
    chips = combinedList.slice(0, 6).map((chip) => (
      <Chip
        key={chip}
        className={clsx(
          styles.sidebarChip,
          selectedKeywords.includes(chip) && styles.sidebarChipActive
        )}
        onClick={() => selectHandler(chip)}
        size='medium'
        font='monospace'
      >
        {chip}
      </Chip>
    ));

    // Show only first 4 element from list
    people = (
      <div className={styles.authors}>
        {combinedList.slice(0, 4).map((person) => (
          <Person
            key={person}
            name={person}
            image='https://via.placeholder.com/36'
            checked={selectedKeywords.includes(person)}
            onClick={() => selectHandler(person)}
          />
        ))}
      </div>
    );
  } else {
    checkboxes = (
      <div className={styles.checkboxGroup}>
        {keywordsList?.map((name) => (
          <Checkbox
            key={name}
            label={name}
            checked={selectedKeywords.includes(name)}
            onChange={() => selectHandler(name)}
          />
        ))}
      </div>
    );
  }

  let renderedList;

  switch (renderComponent) {
    case 'chip':
      renderedList = chips;
      break;
    case 'checkbox':
      renderedList = checkboxes;
      break;
    case 'person':
      renderedList = people;
      break;
  }

  return (
    <div className={styles.category}>
      <div className={styles.sidebarItemTop}>
        <div className={styles.sidebarItemTitle}>
          Keywords
          {selectedKeywords.length > 0 && (
            <span className={styles.selectedCounter}>
              <Badge content={selectedKeywords.length} />
            </span>
          )}
        </div>
        {!open && searchable && (
          <div className={styles.sidebarItemAction} onClick={toggleOpen}>
            <Icon kind='search' width={24} height={24} />
          </div>
        )}
      </div>

      {open && searchable ? (
        <SidebarCategorySearch
          searchValue={searchValue}
          selectHandler={selectHandler}
          searchChangeHandler={searchChangeHandler}
          renderComponent={renderComponent}
          clearInput={clearInput}
          selectedItems={selectedKeywords}
          alphabeticalGroups={list}
        />
      ) : (
        renderedList
      )}

      {searchable && (
        <span role='button' className={styles.toggleView} onClick={toggleOpen}>
          {open ? 'Hide' : 'View All'}
        </span>
      )}
    </div>
  );
}
