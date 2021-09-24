/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React from 'react';
import styles from './Package.module.scss';

export type Props = {
  className?: string;
  variant?: 'grid' | 'lines';
  name: string;
  version: string;
  size?: number;
  bundleSize?: number;
};

export default function Package({ className, variant = 'grid', name, version }: Props) {
  return (
    <div className={clsx(styles.container, styles[variant], className)}>
      <div className={styles.main}>
        <div className={styles.name}>{name}</div>
        <div className={styles.version}>{version}</div>
      </div>
      <div className={styles.meta}>
        <span className={styles.size}>23B</span>
        <span className={styles.percent}>23%</span>
      </div>
    </div>
  );
}
