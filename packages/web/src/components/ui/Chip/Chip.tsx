import React from 'react';
import clsx from 'clsx';
import styles from './Chip.module.scss';
import { IconProps } from '../Icon/Icon';

export type ChipProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'suggest' | string;
  size?: 'default' | 'medium' | 'large' | string;
  font?: 'sans-serif' | 'monospace' | string;
  fontWeight?: 400 | 500;
  icon?: React.ReactElement<IconProps>;
};

export default function Chip({
  children,
  className,
  variant = 'primary',
  size = 'default',
  font = 'sans-serif',
  fontWeight = 400,
  icon,
}: ChipProps) {
  return (
    <span
      className={clsx(
        styles.chip,
        styles[variant],
        styles[size],
        styles[font],
        styles[fontWeight],
        className
      )}
    >
      <span className={styles.icon}>{icon}</span>
      {children}
    </span>
  );
}
