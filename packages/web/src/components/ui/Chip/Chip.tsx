import React from 'react';
import clsx from 'clsx';
import styles from './Chip.module.scss';

export type ChipProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined' | 'suggest' | string;
  size?: 'regular' | 'medium' | 'large' | string;
  font?: 'sans-serif' | 'monospace' | string;
};

export default function Chip({
  children,
  variant = 'primary',
  size = 'regular',
  font = 'sans-serif',
}: ChipProps) {
  return (
    <span className={clsx(styles.chip, styles[variant], styles[size], styles[font])}>
      {children}
    </span>
  );
}
