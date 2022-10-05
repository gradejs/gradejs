import React from 'react';
import styles from './Checkbox.module.scss';

type Props = {
  checked?: boolean;
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function Checkbox({ checked, label, onChange }: Props) {
  return (
    <label className={styles.checkbox}>
      <input
        type='checkbox'
        className={styles.checkboxInput}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkboxName}>{label}</span>
    </label>
  );
}
