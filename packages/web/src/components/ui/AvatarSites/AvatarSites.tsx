import React from 'react';
import styles from './AvatarSites.module.scss';
import AvatarGroup from '../AvatarGroup/AvatarGroup';
import Avatar from '../Avatar/Avatar';
import { formatNumber } from '../../../utils/helpers';

type Props = {
  hostsFaviconList: string[];
  totalUsageCount?: number;
  max?: number;
};

const AvatarSites = ({ hostsFaviconList, totalUsageCount, max }: Props) => (
  <div className={styles.avatarsWrapper}>
    <div className={styles.avatarSites}>
      <AvatarGroup max={max}>
        {hostsFaviconList.map((icon) => (
          <Avatar key={icon} src={icon} />
        ))}
      </AvatarGroup>

      {totalUsageCount && (
        <div className={styles.counter}>+ {formatNumber(totalUsageCount)} sites use</div>
      )}
    </div>
  </div>
);

export default AvatarSites;
