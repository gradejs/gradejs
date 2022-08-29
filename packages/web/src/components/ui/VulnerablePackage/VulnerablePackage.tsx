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
          <Icon kind='bug' color='#F3512E' width={28} height={28} />
        </span>
        {name}
      </span>
      {moreTotal && (
        <span className={styles.vulnerableMore}>
          <Chip variant='secondary' size='medium'>
            +{moreTotal}
            &nbsp;
            <span className={styles.vulnerableMoreText}>more</span>
          </Chip>
        </span>
      )}
    </div>
  );
}
