import React from 'react';
import styles from './SidebarCategory.module.scss';
import Skeleton from '../Skeleton/Skeleton';

type Props = {
  search?: boolean;
};

export default function SidebarCategoryHeaderSkeleton({ search = false }: Props) {
  return (
    <div className={styles.sidebarItemTop}>
      <div className={styles.sidebarItemTitle}>
        <Skeleton width={100} />
      </div>

      {search && <Skeleton width={24} height={24} className={styles.sidebarItemAction} />}
    </div>
  );
}
