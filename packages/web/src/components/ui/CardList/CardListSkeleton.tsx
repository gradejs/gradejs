import React from 'react';
import styles from './CardList.module.scss';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';
import CardCommon from '../Card/CardCommon';

type Props = {
  numberOfElements?: number;
};

export const CardListSkeleton = ({ numberOfElements = 3 }: Props) => (
  <div className={styles.grid}>
    {repeat(
      numberOfElements,
      <Skeleton width='100%' variant='rounded'>
        <CardCommon />
      </Skeleton>
    )}
  </div>
);
