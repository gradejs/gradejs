import React from 'react';
import styles from './BarChart.module.scss';
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

export default function BarChartSkeleton() {
  return (
    <div className={styles.popularity}>
      {repeat(
        6,
        <div className={styles.popularityItemWrapper}>
          <div className={styles.popularityItem}>
            <div
              className={clsx(styles.popularityFill, styles.popularityFillSkeleton)}
              style={{ height: '100%' }}
            >
              <PopularitySkeleton />
            </div>
          </div>

          <PopularityVersionSkeleton />
        </div>
      )}
    </div>
  );
}
