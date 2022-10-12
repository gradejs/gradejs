import React from 'react';
import styles from './SidebarMobileFilter.module.scss';
import { Icon } from '../Icon/Icon';
import { Button } from '../index';
import Badge from '../Badge/Badge';
import clsx from 'clsx';
import { PackageSortType } from '../../../store/slices/scanDisplayOptions';

type ToggleList = {
  name: string;
  count: number;
  onOpen: () => void;
};

type Props = {
  isChanged: boolean;
  resetFilters: () => void;
  onSortOpen: () => void;
  filterTriggers: ToggleList[];
  sortField: PackageSortType;
  sortDirection: 'DESC' | 'ASC';
};

export default function SidebarMobileFilter({
  isChanged,
  resetFilters,
  onSortOpen,
  filterTriggers,
  sortField,
  sortDirection,
}: Props) {
  return (
    <>
      <div className={styles.mobileFiltersTop}>
        <div className={styles.mobileFiltersTitle}>
          <span className={styles.mobileFiltersIcon}>
            <Icon kind='filters' width={16} height={16} color='#8E8AA0' />
          </span>
          Filters
        </div>

        <div>
          <button className={styles.mobileFilterSort} onClick={onSortOpen}>
            Sorted by {sortField[0].toUpperCase() + sortField.slice(1)}
            <Icon
              kind='sort'
              width={10}
              height={9}
              color='#212121'
              className={clsx(styles.sortIcon, sortDirection === 'DESC' && styles.sortIconRotated)}
            />
          </button>
        </div>
      </div>

      {isChanged && (
        <Button
          variant='secondary'
          className={clsx(styles.mobileFilterToggle, styles.mobileFilterToggleReset)}
          onClick={resetFilters}
        >
          <Icon kind='crossOpaque' width={10} height={10} color='#212121' />
        </Button>
      )}

      {filterTriggers.map(({ name, count, onOpen }: ToggleList) => (
        <Button
          key={name}
          variant='secondary'
          size='small'
          className={styles.mobileFilterToggle}
          onClick={onOpen}
        >
          {count > 0 && <Badge content={count} className={styles.mobileSelectedCounter} />}
          {name[0].toUpperCase() + name.slice(1)}
        </Button>
      ))}
    </>
  );
}
