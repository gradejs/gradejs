import React from 'react';
import styles from './SearchedResource.module.scss';
import Skeleton from '../Skeleton/Skeleton';

type Props = {
  image: string;
  name: string;
  totalPackages: number;
  lastScanDate?: string;
  loading?: boolean;
};

export default function SearchedResource({
  image,
  name,
  totalPackages,
  lastScanDate,
  loading,
}: Props) {
  return (
    <div className={styles.searchedResource}>
      <div className={styles.searchedResourceImageWrapper}>
        <img className={styles.searchedResourceImage} src={image} alt='' />
      </div>
      <div className={styles.searchedResourceContent}>
        <h3 className={styles.searchedResourceTitle}>
          {name}{' '}
          {!loading && (
            <span className={styles.searchedResourceHighlight}>{totalPackages} packages</span>
          )}
        </h3>
        {loading ? (
          <div className={styles.searchedResourceSubtitle}>
            <Skeleton width={213} />
          </div>
        ) : (
          <div className={styles.searchedResourceSubtitle}>Last scanning {lastScanDate}</div>
        )}
      </div>
    </div>
  );
}
