import React from 'react';
import styles from './Badge.module.scss';

type Props = {
  content: string | number;
};

export default function Badge({ content }: Props) {
  return <span className={styles.badge}>{content}</span>;
}
