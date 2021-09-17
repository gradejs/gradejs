/* eslint-disable react/button-has-type */
import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

export type Props = {
  className?: string;
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  variant?: 'default' | 'black' | 'action';
  size?: 'medium' | 'big';
  onClick?: () => unknown;
};

export default function Button({
  className,
  type = 'button',
  variant = 'default',
  size = 'big',
  onClick,
  children,
}: Props) {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], className)}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
