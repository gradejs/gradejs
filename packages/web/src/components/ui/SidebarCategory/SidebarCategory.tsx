import React, { useState, useEffect } from 'react';
import styles from './SidebarCategory.module.scss';
import { Icon } from '../Icon/Icon';
import clsx from 'clsx';
import Badge from '../Badge/Badge';
import Chip from '../Chip/Chip';
import Person from '../Person/Person';
import Checkbox from '../Checkbox/Checkbox';
import SidebarCategorySearch from '../SidebarCategorySearch/SidebarCategorySearch';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from 'utils/helpers';

type GroupItem = {
  group: string;
  children: string[];
};

type Group = {
  [key: string]: GroupItem;
};

type Props = {
  categoryName: string;
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (name: string) => void;
  renderComponent: 'chip' | 'checkbox' | 'person';
  searchable?: boolean;
  loading?: boolean;
};

export default function SidebarCategory({
  categoryName,
  keywordsList,
  selectedKeywords,
  selectHandler,
  renderComponent,
  searchable,
  loading,
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
    chips = loading ? (
      <div className={styles.chipSkeletonWrapper}>
        {repeat(
          6,
          <Skeleton variant='rounded' width={69} height={36} className={styles.chipSkeleton} />
        )}
      </div>
    ) : (
      combinedList.slice(0, 6).map((chip) => (
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
      ))
    );

    // Show only first 4 element from list
    people = loading ? (
      repeat(
        4,
        <div className={styles.personSkeleton}>
          <Skeleton
            width={36}
            height={36}
            variant='circular'
            className={styles.personSkeletonImage}
          />
          <Skeleton width={56} />
        </div>
      )
    ) : (
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
    checkboxes = loading ? (
      <div className={styles.checkboxGroup}>
        {repeat(
          3,
          <div className={styles.checkboxSkeleton}>
            <Skeleton width={20} height={20} className={styles.checkboxSkeletonCheck} />
            <Skeleton width={100} />
          </div>
        )}
      </div>
    ) : (
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
          {loading ? <Skeleton width={100} /> : categoryName}
          {selectedKeywords.length > 0 && (
            <span className={styles.selectedCounter}>
              <Badge content={selectedKeywords.length} />
            </span>
          )}
        </div>
        {!open &&
          searchable &&
          (loading ? (
            <Skeleton width={24} height={24} className={styles.sidebarItemAction} />
          ) : (
            <div className={styles.sidebarItemAction} onClick={toggleOpen}>
              <Icon kind='search' width={24} height={24} />
            </div>
          ))}
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

      {searchable && !loading && (
        <span role='button' className={styles.toggleView} onClick={toggleOpen}>
          {open ? 'Hide' : 'View All'}
        </span>
      )}
    </div>
  );
}
