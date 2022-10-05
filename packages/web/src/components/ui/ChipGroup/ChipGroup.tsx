import React from 'react';
import styles from './ChipGroup.module.scss';

type Props = {
  children: React.ReactNode;
};

export default function ChipGroup({ children }: Props) {
  return (
    <div className={styles.chipsWrapper}>
      <div className={styles.chips}>{children}</div>
    </div>
  );
}
