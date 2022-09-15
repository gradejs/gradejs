import React from 'react';
import styles from './SitesList.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from '../../../utils/helpers';

export const SiteSkeleton = () => (
  <div className={styles.site}>
    <div className={styles.imageWrapper}>
      <Skeleton width={36} height={36} variant='circular' />
    </div>
    <div className={styles.content}>
      <Skeleton width={116} />
      <Skeleton width={86} />
    </div>
  </div>
);

export const SitesListSkeleton = () => <>{repeat(4, <SiteSkeleton />)}</>;
