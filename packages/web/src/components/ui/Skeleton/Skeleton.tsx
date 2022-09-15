import React from 'react';
import styles from './Skeleton.module.scss';
import clsx from 'clsx';

type Props = {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'circular' | 'rounded' | 'rectangular';
  className?: string;
  children?: React.ReactNode;
};

export default function Skeleton({ variant = 'text', className, width, height, children }: Props) {
  return (
    <span
      className={clsx(
        styles.skeleton,
        styles[variant],
        children && styles.hasChildren,
        children && !width && styles.hasChildrenNoWidth,
        children && !height && styles.hasChildrenNoHeight,
        className
      )}
      style={{ width: width, height: height }}
    >
      {children && <span>{children}</span>}
    </span>
  );
}
