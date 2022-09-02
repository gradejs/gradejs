import React from 'react';
import clsx from 'clsx';
import styles from './Person.module.scss';
import { Icon } from '../Icon/Icon';

type Props = {
  image?: string;
  name: string;
  checked?: boolean;
};

export default function Person({ image, name, checked }: Props) {
  return (
    <div className={clsx(styles.person, checked && styles.personActive)}>
      <div className={styles.personImageWrapper}>
        <img className={styles.personImage} src={image} alt='' />
      </div>
      <div className={styles.personText}>
        <span className={styles.personName}>{name}</span>
        {checked && (
          <span className={styles.personCheck}>
            <Icon kind='check' width={12} height={10} color='#212121' />
          </span>
        )}
      </div>
    </div>
  );
}
