import React from 'react';
import styles from './SortsList.module.scss';
import { PackageSorters, PackageSortType } from '../../../store/slices/scanDisplayOptions';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import { capitalizeWord } from 'utils/helpers';

type Props = {
  availableSorters: PackageSortType[];
  selectedSorters: PackageSorters;
  onSortChange: (newSorterName: PackageSortType) => void;
};

const SortsList = ({ availableSorters, selectedSorters, onSortChange }: Props) => {
  const { by, direction } = selectedSorters;

  return (
    <div className={styles.sortsList}>
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
              height={13}
              color='#212121'
              className={clsx(direction === 'DESC' && styles.sortIconRotated)}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default SortsList;
