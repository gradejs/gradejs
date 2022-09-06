import React from 'react';
import styles from './AvatarGroup.module.scss';
import { formatNumber } from '../../../utils/helpers';

type Props = {
  avatarGroup: string[];
  counter: number;
};

export default function AvatarGroup({ avatarGroup, counter }: Props) {
  return (
    <div className={styles.avatarsWrapper}>
      <div className={styles.avatars}>
        <div className={styles.avatarGroup}>
          {avatarGroup.map((avatar, idx) => (
            <div key={idx} className={styles.avatarItem}>
              <img src={avatar} className={styles.avatarImage} alt='' />
            </div>
          ))}
        </div>

        <div className={styles.counter}>+ {formatNumber(counter)} sites use</div>
      </div>
    </div>
  );
}
