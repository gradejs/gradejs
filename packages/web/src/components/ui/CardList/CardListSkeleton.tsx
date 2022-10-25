import React from 'react';
import styles from './CardList.module.scss';
import { repeat } from '../../../utils/helpers';
import CardSkeleton from '../Card/CardSkeleton';

type Props = {
  numberOfElements?: number;
};

export const CardListSkeleton = ({ numberOfElements = 3 }: Props) => (
  <div className={styles.grid}>{repeat(numberOfElements, <CardSkeleton />)}</div>
);
