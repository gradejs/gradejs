/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React from 'react';
import styles from './Package.module.scss';

export type Props = {
  className?: string;
  variant?: 'grid' | 'lines';
  name: string;
  version: string;
  relativeSize?: number;
  absoluteSize?: number;
};

export default function Package({ className, variant = 'grid', name, version, relativeSize, absoluteSize }: Props) {
  return (
    <div className={clsx(styles.container, styles[variant], className)}>
      <div className={styles.main}>
        <div className={styles.name}>{name}</div>
        <div className={styles.version}>{version}</div>
      </div>
      <div className={styles.meta}>
        {absoluteSize && (
          <span className={styles.size}>{absoluteSize}KB</span>
        )}
        {relativeSize && (
          <span className={styles.percent}>{relativeSize}%</span>
        )}
      </div>
    </div>
  );
}
