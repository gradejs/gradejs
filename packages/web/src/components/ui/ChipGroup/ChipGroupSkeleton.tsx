import React from 'react';
import { repeat } from '../../../utils/helpers';
import Skeleton from '../Skeleton/Skeleton';
import ChipGroup from './ChipGroup';

export const ChipGroupSkeleton = () => (
  <ChipGroup>{repeat(4, <Skeleton variant='rounded' width={108} height={36} />)}</ChipGroup>
);
