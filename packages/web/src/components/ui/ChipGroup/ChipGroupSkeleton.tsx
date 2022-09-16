import React from 'react';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';
import styles from './ChipGroup.module.scss';

export const ChipGroupSkeleton = () => (
  <div className={styles.chips}>
    {repeat(4, <Skeleton variant='rounded' width={108} height={36} className={styles.chip} />)}
  </div>
);
