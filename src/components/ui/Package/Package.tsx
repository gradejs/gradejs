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

const EPSILON = 0.01;
const formatNumericalValue = (value: number) => value < EPSILON ? '~0.01' : value;

export default function Package({ className, variant = 'grid', name, version, relativeSize, absoluteSize }: Props) {
  return (
    <div className={clsx(styles.container, styles[variant], className)}>
      <div className={styles.main}>
        <div className={styles.name}>{name}</div>
        <div className={styles.version}>{version}</div>
      </div>
      <div className={styles.meta}>
        {typeof absoluteSize === 'number' && (
          <span className={styles.size}>{formatNumericalValue(absoluteSize)}KB</span>
        )}
        {typeof relativeSize === 'number' && (
          <span className={styles.percent}>{formatNumericalValue(relativeSize)}%</span>
        )}
      </div>
    </div>
  );
}
