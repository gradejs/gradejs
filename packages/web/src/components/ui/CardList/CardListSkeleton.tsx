import React from 'react';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';
import Card from '../Card/Card';

export const CardListSkeleton = () => (
  <>
    {repeat(
      3,
      <Skeleton width='100%' variant='rounded'>
        <Card id='id1' title='title' />
      </Skeleton>
    )}
  </>
);
