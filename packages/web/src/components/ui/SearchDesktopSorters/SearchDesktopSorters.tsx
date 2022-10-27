import React from 'react';
import clsx from 'clsx';
import styles from '../../layouts/SearchResults/SearchResults.module.scss';
import { Icon } from '../Icon/Icon';
import { PackageSorters, PackageSortType } from '../../../store/slices/scanDisplayOptions';
import { capitalizeWord } from '../../../utils/helpers';

type Props = {
  availableSorters: PackageSortType[];
  selectedSorters: PackageSorters;
  onSortChange: (newSorters: PackageSortType) => void;
};

const SearchDesktopSorters = ({ availableSorters, selectedSorters, onSortChange }: Props) => {
  const { by, direction } = selectedSorters;

  return (
    <>
      {availableSorters.map((sorter) => (
        <button
          key={sorter}
          className={clsx(styles.sortButton, by === sorter && styles.sortButtonActive)}
          onClick={() => onSortChange(sorter)}
        >
          {capitalizeWord(sorter)}
          {by === sorter && (
            <Icon
              kind='sort'
              width={14}
              height={10}
              className={clsx(styles.sortIcon, direction === 'DESC' && styles.sortIconRotated)}
            />
          )}
        </button>
      ))}
    </>
  );
};

export default SearchDesktopSorters;
