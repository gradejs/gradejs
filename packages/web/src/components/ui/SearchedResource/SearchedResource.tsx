import React from 'react';
import styles from './SearchedResource.module.scss';
import { Icon } from '../Icon/Icon';

type Props = {
  image?: string;
  name: string;
  totalPackages: number;
  lastScanDate?: string;
  onRescanRequested?: () => void;
};

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function SearchedResource({
  image,
  name,
  totalPackages,
  lastScanDate,
  onRescanRequested,
}: Props) {
  return (
    <div className={styles.searchedResource}>
      {image && (
        <div className={styles.searchedResourceImageWrapper}>
          <img className={styles.searchedResourceImage} src={image} alt='' />
        </div>
      )}

      <div className={styles.searchedResourceContent}>
        <h3 className={styles.searchedResourceTitle}>
          {name} <span className={styles.searchedResourceHighlight}>{totalPackages} packages</span>
        </h3>
        {!!lastScanDate && (
          <div className={styles.searchedResourceSubtitle}>
            <div className={styles.searchedResourceScanDate}>
              Last scanned on&nbsp;
              {dateTimeFormatter.format(new Date(lastScanDate)).replace(', ', ' at ')}
            </div>
            {!!onRescanRequested && (
              <button className={styles.searchedResourceRescanButton} onClick={onRescanRequested}>
                <Icon kind='refresh' className={styles.searchedResourceRescanButtonIcon} />
                Update
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
