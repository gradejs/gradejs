import React from 'react';
import styles from './SidebarMeta.module.scss';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';

export const SidebarMetaSkeleton = () => (
  <div className={styles.meta}>
    {repeat(
      5,
      <div className={styles.skeleton}>
        <Skeleton width={18} height={18} variant='circular' className={styles.skeletonIcon} />
        <Skeleton width='100%' />
      </div>
    )}
  </div>
);
