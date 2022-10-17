import React from 'react';
import clsx from 'clsx';
import styles from '../../layouts/SearchResults/SearchResults.module.scss';
import { Icon } from '../Icon/Icon';
import { PackageSortType } from '../../../store/slices/scanDisplayOptions';

type Props = {
  availableSorters: PackageSortType[];
  sortField: PackageSortType;
  sortDirection: 'DESC' | 'ASC';
  handleSortChange: (newSorterName: PackageSortType) => void;
};

const SearchDesktopSorters = ({
  availableSorters,
  sortField,
  sortDirection,
  handleSortChange,
}: Props) => {
  return (
    <>
      {availableSorters.map((sorter) => (
        <button
          key={sorter}
          className={clsx(styles.sortButton, sortField === sorter && styles.sortButtonActive)}
          onClick={() => handleSortChange(sorter)}
        >
          {sorter[0].toUpperCase() + sorter.slice(1)}
          {sortField === sorter && (
            <Icon
              kind='sort'
              width={10}
              height={9}
              className={clsx(styles.sortIcon, sortDirection === 'DESC' && styles.sortIconRotated)}
            />
          )}
        </button>
      ))}
    </>
  );
};

export default SearchDesktopSorters;
