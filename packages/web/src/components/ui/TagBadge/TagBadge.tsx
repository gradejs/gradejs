import React from 'react';
import clsx from 'clsx';
import styles from './TagBadge.module.scss';

export type Props = {
  children: React.ReactNode;
  color: 'red' | 'yellow' | 'gray' | string;
};

export default function TagBadge({ children, color }: Props) {
  return <span className={clsx(styles.tagBadge, styles[color])}>{children}</span>;
}
