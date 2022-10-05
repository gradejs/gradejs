import React from 'react';
import clsx from 'clsx';
import styles from './Person.module.scss';
import { Icon } from '../Icon/Icon';

type Props = {
  image?: string;
  name: string;
  checked?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export default function Person({ image, name, checked, className, onClick }: Props) {
  return (
    <div
      className={clsx(styles.person, checked && styles.personActive, className)}
      onClick={onClick}
    >
      {!!image && (
        <div className={styles.personImageWrapper}>
          <img className={styles.personImage} src={image} alt='' />
        </div>
      )}
      <div className={styles.personText}>
        <span className={styles.personName}>{name}</span>
        {checked ? (
          <span className={styles.personCheck}>
            <Icon kind='check' width={12} height={10} color='#212121' />
          </span>
        ) : (
          <span className={styles.personCheckPlaceholder} />
        )}
      </div>
    </div>
  );
}
