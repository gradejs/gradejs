import React from 'react';
import styles from './VersionPopularityChart.module.scss';
import clsx from 'clsx';
import { repeat } from 'utils/helpers';
import Skeleton from '../Skeleton/Skeleton';

const PopularitySkeleton = () => (
  <Skeleton
    variant='rectangular'
    width='100%'
    height='100%'
    className={styles.popularitySkeleton}
  />
);

const PopularityVersionSkeleton = () => (
  <Skeleton width={64} className={styles.popularityVersionSkeleton} />
);

export default function VersionPopularityChartSkeleton() {
  return (
    <div className={styles.container}>
      {repeat(
        6,
        <div className={styles.barWrapper}>
          <div className={styles.barContainer}>
            <div className={clsx(styles.bar, styles.barSkeleton)}>
              <PopularitySkeleton />
            </div>
          </div>

          <PopularityVersionSkeleton />
        </div>
      )}
    </div>
  );
}
