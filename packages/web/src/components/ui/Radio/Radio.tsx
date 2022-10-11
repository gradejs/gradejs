import React from 'react';
import styles from './Radio.module.scss';
import clsx from 'clsx';

export type Props = {
  className?: string;
  name: string;
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Radio({
  className,
  name,
  value,
  disabled,
  checked,
  onChange,
  children,
}: Props) {
  return (
    <label className={clsx(styles.container, className)}>
      <input
        type='radio'
        onChange={onChange}
        name={name}
        value={value}
        className={clsx(styles.input, className)}
        disabled={disabled}
        checked={checked}
      />
      <span className={styles.text}>{children}</span>
    </label>
  );
}
