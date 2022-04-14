import React from 'react';
import styles from './HighlightTech.module.scss';

export type Props = {
  description: string;
  title: string;
  icon: string;
};

export default function HighlightTech({ title, description, icon }: Props) {
  return (
    <div className={styles.container}>
      <img className={styles.icon} alt={title} src={icon} />
      <div className={styles.info}>
        <div className={styles.description}>{description}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
}
