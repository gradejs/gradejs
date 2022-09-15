import React from 'react';
import styles from './Badge.module.scss';
import clsx from 'clsx';

type Props = {
  content: string | number;
  className?: string;
};

export default function Badge({ content, className }: Props) {
  return <span className={clsx(styles.badge, className)}>{content}</span>;
}
