import React from 'react';
import styles from './CardSkeleton.module.scss';
import Skeleton from '../Skeleton/Skeleton';

const CardSkeleton = () => {
  return <Skeleton width='100%' variant='rounded' className={styles.cardSkeleton} />;
};

export default CardSkeleton;
