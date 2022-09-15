import React from 'react';
import styles from './SearchedResource.module.scss';
import Skeleton from '../Skeleton/Skeleton';

type Props = {
  image: string;
  name: string;
};

export const SearchedResourceSkeleton = ({ image, name }: Props) => (
  <div className={styles.searchedResource}>
    <div className={styles.searchedResourceImageWrapper}>
      <img className={styles.searchedResourceImage} src={image} alt='' />
    </div>
    <div className={styles.searchedResourceContent}>
      <h3 className={styles.searchedResourceTitle}>
        {name} <Skeleton width={175} className={styles.searchedResourceHighlightSkeleton} />
      </h3>
      <div className={styles.searchedResourceSubtitle}>
        <Skeleton width={213} />
      </div>
    </div>
  </div>
);
