import React from 'react';
import styles from './VulnerablePackage.module.scss';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';

type Props = {
  name: string;
  moreTotal?: number;
};

export default function VulnerablePackage({ name, moreTotal }: Props) {
  return (
    <div className={styles.vulnerableWrapper}>
      <span className={styles.vulnerablePackage}>
        <span className={styles.vulnerableIcon}>
          <Icon kind='vulnerability' color='#F3512E' width={24} height={24} />
        </span>
        <span className={styles.vulnerablePackageName}>{name}</span>
      </span>
      {!!moreTotal && (
        <span className={styles.vulnerableMore}>
          <Chip variant='secondary'>
            +{moreTotal}
            &nbsp;
            <span className={styles.vulnerableMoreText}>more</span>
          </Chip>
        </span>
      )}
    </div>
  );
}
