import React from 'react';
import styles from './PeopleList.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from '../../../utils/helpers';

export const PeopleListSkeleton = () => (
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
