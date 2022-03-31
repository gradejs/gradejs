/* eslint-disable react/button-has-type */
import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import styles from './TextInput.module.scss';

export type Props = {
  className?: string;
  placeholder?: string;
  register?: UseFormRegister<Record<string, unknown>>;
  name?: string;
  error?: FieldError;
};

export default function TextInput({ error, className, placeholder, name, register }: Props) {
  return (
    <input
      {...(name && register ? register(name) : {})}
      className={clsx(styles.input, className, { [styles.error]: !!error })}
      placeholder={placeholder}
    />
  );
}
