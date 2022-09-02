import React from 'react';
import styles from './Checkbox.module.scss';

type Props = {
  checked?: boolean;
  label: string;
};

export default function Checkbox({ checked, label }: Props) {
  return (
    <label className={styles.checkbox}>
      <input type='checkbox' className={styles.checkboxInput} checked={checked} />
      <span className={styles.checkboxName}>{label}</span>
    </label>
  );
}
