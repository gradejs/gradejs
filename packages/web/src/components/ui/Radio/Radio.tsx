/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {MouseEventHandler} from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';

export type Props = {
  className?: string;
  name: string;
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  appearance: 'default' | 'justify';
  labelPosition?: 'left' | 'right';
  onClick?: MouseEventHandler;
};

export default function Radio({
  className,
  name,
  value,
  disabled,
  appearance,
  labelPosition,
  onClick,
  children,
}: Props) {
  return (
    <label className={clsx(styles.container, styles[appearance])}>
      {(!labelPosition || labelPosition === 'left') && <span className={styles.labelContent}>{children}</span>}
      <input type='radio'
        name={name}
        value={value}
        className={clsx(styles.control, styles[appearance], className)}
        onClick={onClick}
        disabled={disabled}
      />
      {(labelPosition && labelPosition === 'right') && <span className={styles.labelContent}>{children}</span>}
    </label>
  );
}
