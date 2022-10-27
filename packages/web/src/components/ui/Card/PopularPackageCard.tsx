import React from 'react';
import styles from './Card.module.scss';
import Card from './Card';
import AvatarGroup from '../AvatarGroup/AvatarGroup';
import Avatar from '../Avatar/Avatar';
import { formatNumber } from '../../../utils/helpers';

export type PopularPackageCardProps = {
  packageName: string;
  packageDescription?: string;
  hostsFaviconList: string[];
  totalUsageCount: number;
};

const PopularPackageCard = ({
  packageName,
  packageDescription,
  hostsFaviconList,
  totalUsageCount,
}: PopularPackageCardProps) => (
  <Card title={packageName} description={packageDescription} to={`/package/${packageName}`}>
    <div className={styles.avatarsWrapper}>
      <div className={styles.avatarSites}>
        <AvatarGroup>
          {hostsFaviconList.map((icon) => (
            <Avatar key={icon} src={icon} />
          ))}
        </AvatarGroup>

        <div className={styles.counter}>+ {formatNumber(totalUsageCount)} sites use</div>
      </div>
    </div>
  </Card>
);

export default PopularPackageCard;
