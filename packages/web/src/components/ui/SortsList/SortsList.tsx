import React from 'react';
import styles from './SortsList.module.scss';
import { PackageSorter, PackageSortType } from '../../../store/slices/scanDisplayOptions';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import { capitalizeWord } from 'utils/helpers';

type Props = {
  availableSorters: PackageSortType[];
  selectedSortField: PackageSorter['by'];
  selectedSortDirection: PackageSorter['direction'];
  onSortChange: (newSorterName: PackageSortType) => void;
};

const SortsList = ({
  availableSorters,
  selectedSortField,
  selectedSortDirection,
  onSortChange,
}: Props) => {
  return (
    <div className={styles.sortsList}>
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
              width={14}
              height={13}
              color='#212121'
              className={clsx(selectedSortDirection === 'DESC' && styles.sortIconRotated)}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default SortsList;
