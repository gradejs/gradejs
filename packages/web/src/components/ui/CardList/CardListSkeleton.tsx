import React from 'react';
import styles from './CardList.module.scss';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';
import Card from '../Card/Card';

export const CardListSkeleton = () => (
  <div className={styles.grid}>
    {repeat(
      3,
      <Skeleton width='100%' variant='rounded'>
        <Card id='id1' title='title' />
      </Skeleton>
    )}
  </div>
);
