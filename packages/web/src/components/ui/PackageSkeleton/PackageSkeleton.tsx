/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React from 'react';
import styles from './PackageSkeleton.module.scss';

export type Props = {
  className?: string;
};

export default function PackageSkeleton({ className }: Props) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.main}>
        <div className={styles.name} />
        <div className={styles.version} />
      </div>
    </div>
  );
}
