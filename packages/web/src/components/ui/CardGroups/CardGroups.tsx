import React from 'react';
import styles from './CardGroups.module.scss';

export type CardGroupsProps = {
  children: React.ReactNode;
};

export default function CardGroups({ children }: CardGroupsProps) {
  return <div className={styles.groups}>{children}</div>;
}
