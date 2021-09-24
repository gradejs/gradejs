import clsx from 'clsx';
import React from 'react';
import styles from './Section.module.scss';

export type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Section({ className, children }: Props) {
  return <section className={clsx(styles.container, className)}>{children}</section>;
}
