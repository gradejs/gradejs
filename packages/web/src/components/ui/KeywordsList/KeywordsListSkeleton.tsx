import React from 'react';
import styles from './KeywordsList.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from '../../../utils/helpers';

export const KeywordsListSkeleton = () => (
  <div className={styles.chipSkeletonWrapper}>
    {repeat(
      6,
      <Skeleton variant='rounded' width={69} height={36} className={styles.chipSkeleton} />
    )}
  </div>
);
