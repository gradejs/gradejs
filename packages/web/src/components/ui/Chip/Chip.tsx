import React from 'react';
import clsx from 'clsx';
import styles from './Chip.module.scss';
import { IconProps } from '../Icon/Icon';

export type ChipProps = {
  children: React.ReactNode;
  className?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outlined'
    | 'suggest'
    | 'vulnerabilities'
    | 'duplicate'
    | 'outdated'
    | 'info'
    | 'active';
  size?: 'badge' | 'default' | 'medium' | 'large';
  font?: 'sans-serif' | 'monospace';
  fontWeight?: 'normal' | 'semiBold';
  fontSize?: 'small' | 'regular';
  icon?: React.ReactElement<IconProps>;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

export default function Chip({
  children,
  className,
  variant = 'primary',
  size = 'default',
  font = 'sans-serif',
  fontWeight = 'normal',
  fontSize = 'regular',
  icon,
  title,
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
      title={title}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </span>
  );
}
