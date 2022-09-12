import React, { MouseEventHandler } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

export type Props = {
  className?: string;
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  // TODO fix types after redesign refactoring
  variant?: 'default' | 'arrow' | 'secondary' | string;
  size?: 'small' | 'medium' | 'big';
  disabled?: boolean;
  onClick?: MouseEventHandler;
};

export default function Button({
  className,
  type = 'button',
  variant = 'default',
  size = 'big',
  disabled,
  onClick,
  children,
}: Props) {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], className)}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {variant === 'arrow' && (
        <span className={styles.arrowIcon}>
          <span className={styles.arrowIconBackground} />
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              className={styles.chevron}
              d='M13 18L19 12L13 6'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              className={styles.line}
              pathLength='1'
              d='M19 12L5 12'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>
      )}
    </button>
  );
}
