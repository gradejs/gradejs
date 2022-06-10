/* eslint-disable react/button-has-type */
import React from 'react';
import clsx from 'clsx';
import { UseFormRegister } from 'react-hook-form';
import styles from './Radio.module.scss';

export type Props = {
  className?: string;
  name: string;
  value: string;
  children: React.ReactNode;
  register?: UseFormRegister<any>;
  disabled?: boolean;
  appearance: 'default' | 'justify';
  labelPosition?: 'left' | 'right';
  // eslint-disable-next-line no-unused-vars
  onSelect?: (_value: string) => void;
};

export default function Radio({
  className,
  name,
  value,
  disabled,
  appearance,
  register,
  labelPosition,
  onSelect,
  children,
}: Props) {
  return (
    <label className={clsx(styles.container, styles[appearance])}>
      {(!labelPosition || labelPosition === 'left') && (
        <span className={clsx(styles.labelContent, styles.labelLeft)}>{children}</span>
      )}
      <input
        type='radio'
        {...(name && register ? register(name) : {})}
        onSelect={() => onSelect?.(value)}
        name={name}
        value={value}
        className={clsx(styles.control, styles[appearance], className)}
        disabled={disabled}
      />
      {labelPosition && labelPosition === 'right' && (
        <span className={clsx(styles.labelContent, styles.labelRight)}>{children}</span>
      )}
    </label>
  );
}
