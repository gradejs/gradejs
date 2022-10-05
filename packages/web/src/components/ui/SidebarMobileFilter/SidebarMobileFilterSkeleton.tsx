import styles from '../../layouts/SearchResults/SearchResults.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from '../../../utils/helpers';
import React from 'react';

export const SidebarMobileFilterSkeleton = () => (
  <>
    <div className={styles.mobileFiltersTop}>
      <div className={styles.mobileFiltersTitle}>
        <span className={styles.mobileFiltersIcon}>
          <Skeleton width={16} height={16} variant='circular' />
        </span>
        <Skeleton width={50} />
      </div>
    </div>

    {repeat(
      3,
      <Skeleton width={100} height={40} variant='rounded' className={styles.mobileFilterToggle} />
    )}
  </>
);
