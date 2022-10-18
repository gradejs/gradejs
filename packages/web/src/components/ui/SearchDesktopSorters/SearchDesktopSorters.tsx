import React from 'react';
import clsx from 'clsx';
import styles from '../../layouts/SearchResults/SearchResults.module.scss';
import { Icon } from '../Icon/Icon';
import { PackageSorter, PackageSortType } from '../../../store/slices/scanDisplayOptions';
import { capitalizeWord } from '../../../utils/helpers';

type Props = {
  availableSorters: PackageSortType[];
  selectedSortField: PackageSorter['by'];
  selectedSortDirection: PackageSorter['direction'];
  onSortChange: (newSorters: PackageSortType) => void;
};

const SearchDesktopSorters = ({
  availableSorters,
  selectedSortField,
  selectedSortDirection,
  onSortChange,
}: Props) => {
  return (
    <>
      {availableSorters.map((sorter) => (
        <button
          key={sorter}
          className={clsx(
            styles.sortButton,
            selectedSortField === sorter && styles.sortButtonActive
          )}
          onClick={() => onSortChange(sorter)}
        >
          {capitalizeWord(sorter)}
          {selectedSortField === sorter && (
            <Icon
              kind='sort'
              width={10}
              height={9}
              className={clsx(
                styles.sortIcon,
                selectedSortDirection === 'DESC' && styles.sortIconRotated
              )}
            />
          )}
        </button>
      ))}
    </>
  );
};

export default SearchDesktopSorters;
