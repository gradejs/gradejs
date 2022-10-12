import React from 'react';
import styles from './SortsList.module.scss';
import { PackageSortType } from '../../../store/slices/scanDisplayOptions';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';

type Props = {
  availableSorters: PackageSortType[];
  sortField: PackageSortType;
  sortDirection: 'DESC' | 'ASC';
  onSortersChange: (newSorterName: PackageSortType) => void;
};

const SortsList = ({ availableSorters, sortField, sortDirection, onSortersChange }: Props) => {
  return (
    <div className={styles.sortsList}>
      {availableSorters.map((sorter) => (
        <button
          key={sorter}
          className={clsx(styles.sortButton, sortField === sorter && styles.sortButtonActive)}
          onClick={() => onSortersChange(sorter)}
        >
          {sorter[0].toUpperCase() + sorter.slice(1)}
          {sortField === sorter && (
            <Icon
              kind='sort'
              width={14}
              height={13}
              color='#212121'
              className={clsx(sortDirection === 'DESC' && styles.sortIconRotated)}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default SortsList;
