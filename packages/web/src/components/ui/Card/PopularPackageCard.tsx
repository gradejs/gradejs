import React from 'react';
import Card from './Card';
import AvatarSites from '../AvatarSites/AvatarSites';

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
  <Card title={packageName} description={packageDescription}>
    <AvatarSites hostsFaviconList={hostsFaviconList} totalUsageCount={totalUsageCount} />
  </Card>
);

export default PopularPackageCard;
