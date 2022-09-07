import React from 'react';
import clsx from 'clsx';
import styles from './Chip.module.scss';
import { IconProps } from '../Icon/Icon';

export type ChipProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'suggest';
  size?: 'default' | 'medium' | 'large';
  font?: 'sans-serif' | 'monospace';
  fontWeight?: 400 | 500;
  fontSize?: 'small' | 'regular';
  icon?: React.ReactElement<IconProps>;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

export default function Chip({
  children,
  className,
  variant = 'primary',
  size = 'default',
  font = 'sans-serif',
  fontWeight = 400,
  fontSize = 'regular',
  icon,
  onClick,
}: ChipProps) {
  return (
    <span
      className={clsx(
        styles.chip,
        styles[variant],
        styles[size],
        styles[font],
        styles[fontWeight],
        fontSize === 'small' && styles.smallFont,
        className
      )}
      onClick={onClick}
    >
      <span className={styles.icon}>{icon}</span>
      {children}
    </span>
  );
}
