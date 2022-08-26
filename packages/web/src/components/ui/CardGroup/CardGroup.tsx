import React from 'react';
import styles from './CardGroup.module.scss';

export type CardGroupProps = {
  title?: string;
  children: React.ReactNode;
};

export default function CardGroup({ title, children }: CardGroupProps) {
  return (
    <div className={styles.group}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
}
