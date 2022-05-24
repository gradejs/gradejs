/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React from 'react';
import styles from './Package.module.scss';

export type DetectedPackageData = {
  packageName: string;
  possiblePackageVersions: string[];
  packageVersionRange: string;
  packageMetadata?: {
    approximateByteSize?: number;
  };
}

export type Props = {
  className?: string;
  variant?: 'grid' | 'lines';
  pkg: DetectedPackageData;
};

export default function Package({ className, variant = 'grid', pkg }: Props) {

  return (
    <div className={clsx(styles.container, styles[variant], className)}>
      <div className={styles.main}>
        <div className={styles.name}>{pkg.packageName}</div>
        <div className={styles.version}>{pkg.packageVersionRange}</div>
      </div>
      <div className={styles.meta}>
        {!!pkg.packageMetadata?.approximateByteSize && (
          <span className={styles.size}>pkg.packageMetadata.approximateByteSizeB</span>
        )}
        {/* <span className={styles.percent}>23%</span> */}
      </div>
    </div>
  );
}
