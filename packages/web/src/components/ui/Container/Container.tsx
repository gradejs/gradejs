import React from 'react';
import styles from './Container.module.scss';

export type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>;
}
