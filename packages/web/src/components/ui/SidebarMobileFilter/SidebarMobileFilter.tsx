import React from 'react';
import styles from '../../layouts/SearchResults/SearchResults.module.scss';
import { Icon } from '../Icon/Icon';
import { Button } from '../index';
import Badge from '../Badge/Badge';
import { SidebarMobileFilterSkeleton } from './SidebarMobileFilterSkeleton';

type toggleList = {
  name: string;
  state: [];
};

type Props = {
  loading?: boolean;
  isChanged: boolean;
  resetFilters: () => void;
  filterToggles: any[];
  openOffCanvas: (name: string) => void;
};

export default function SidebarMobileFilter({
  loading,
  isChanged,
  resetFilters,
  filterToggles,
  openOffCanvas,
}: Props) {
  if (loading) {
    return <SidebarMobileFilterSkeleton />;
  }

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

      {filterToggles.map(({ name, state }: toggleList) => (
        <Button
          key={name}
          variant='secondary'
          size='small'
          className={styles.mobileFilterToggle}
          onClick={() => openOffCanvas(name)}
        >
          {state.length > 0 && (
            <Badge content={state.length} className={styles.mobileSelectedCounter} />
          )}
          {name[0].toUpperCase() + name.slice(1)}
        </Button>
      ))}
    </>
  );
}
