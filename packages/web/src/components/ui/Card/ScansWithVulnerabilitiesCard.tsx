import React from 'react';
import Card from './Card';
import VulnerablePackage from '../VulnerablePackage/VulnerablePackage';

export type ScansWithVulnerabilitiesCardProps = {
  sourceTitle: string;
  sourceUrl?: string;
  vulnerablePackageName: string;
  additionalVulnerabilitiesCount?: number;
};

const ScansWithVulnerabilitiesCard = ({
  sourceTitle,
  sourceUrl,
  vulnerablePackageName,
  additionalVulnerabilitiesCount,
}: ScansWithVulnerabilitiesCardProps) => (
  <Card title={sourceTitle} variant='small' to={sourceUrl}>
    <VulnerablePackage name={vulnerablePackageName} moreTotal={additionalVulnerabilitiesCount} />
  </Card>
);

export default ScansWithVulnerabilitiesCard;
