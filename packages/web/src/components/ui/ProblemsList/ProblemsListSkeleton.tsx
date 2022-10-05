import React from 'react';
import styles from './ProblemsList.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from '../../../utils/helpers';

export const ProblemsListSkeleton = () => (
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
