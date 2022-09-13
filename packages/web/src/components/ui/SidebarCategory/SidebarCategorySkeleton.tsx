import React from 'react';
import styles from './SidebarCategory.module.scss';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';

export const ChipsSkeleton = () => (
  <div className={styles.chipSkeletonWrapper}>
    {repeat(
      6,
      <Skeleton variant='rounded' width={69} height={36} className={styles.chipSkeleton} />
    )}
  </div>
);

export const PeopleSkeleton = () => (
  <>
    {repeat(
      4,
      <div className={styles.personSkeleton}>
        <Skeleton
          width={36}
          height={36}
          variant='circular'
          className={styles.personSkeletonImage}
        />
        <Skeleton width={56} />
      </div>
    )}
  </>
);

export const CheckboxesSkeleton = () => (
  <div className={styles.checkboxGroup}>
    {repeat(
      3,
      <div className={styles.checkboxSkeleton}>
        <Skeleton width={20} height={20} className={styles.checkboxSkeletonCheck} />
        <Skeleton width={100} />
      </div>
    )}
  </div>
);

export const CategoryNameSkeleton = () => <Skeleton width={100} />;

export const SearchIconSkeleton = () => (
  <Skeleton width={24} height={24} className={styles.sidebarItemAction} />
);
