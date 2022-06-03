/* eslint-disable react/button-has-type */
import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import styles from './TextInput.module.scss';

export type Props = {
  className?: string;
  placeholder?: string;
  register?: UseFormRegister<any>;
  name?: string;
  error?: FieldError;
  disabled?: boolean;
  size?: 'medium' | 'big';
};

export default function TextInput({
  error,
  className,
  placeholder,
  name,
  size = 'big',
  register,
  disabled,
}: Props) {
  return (
    <input
      {...(name && register ? register(name) : {})}
      className={clsx(styles.input, className, styles[size], { [styles.error]: !!error })}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
