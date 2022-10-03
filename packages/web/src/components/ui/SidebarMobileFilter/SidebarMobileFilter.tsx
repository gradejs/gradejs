import React from 'react';
import styles from './SidebarMobileFilter.module.scss';
import { Icon } from '../Icon/Icon';
import { Button } from '../index';
import Badge from '../Badge/Badge';

type ToggleList = {
  name: string;
  count: number;
  onOpen: () => void;
};

type Props = {
  isChanged: boolean;
  resetFilters: () => void;
  filterTriggers: ToggleList[];
};

export default function SidebarMobileFilter({ isChanged, resetFilters, filterTriggers }: Props) {
  return (
    <>
      <div className={styles.mobileFiltersTop}>
        <div className={styles.mobileFiltersTitle}>
          <span className={styles.mobileFiltersIcon}>
            <Icon kind='filters' width={16} height={16} color='#8E8AA0' />
          </span>
          Filters
        </div>

        {isChanged && (
          <div className={styles.mobileFiltersResetWrapper}>
            <span className={styles.mobileFiltersReset} onClick={resetFilters}>
              Reset
            </span>
          </div>
        )}
      </div>

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
