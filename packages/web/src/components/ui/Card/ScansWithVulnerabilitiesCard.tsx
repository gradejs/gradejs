import React from 'react';
import Card from './Card';
import VulnerablePackage from '../VulnerablePackage/VulnerablePackage';

export type ScansWithVulnerabilitiesCardProps = {
  sourcePageUrl: string;
  vulnerablePackageName: string;
  additionalVulnerabilitiesCount?: number;
};

const ScansWithVulnerabilitiesCard = ({
  sourcePageUrl,
  vulnerablePackageName,
  additionalVulnerabilitiesCount,
}: ScansWithVulnerabilitiesCardProps) => (
  <Card title={sourcePageUrl} variant='small' to={`/scan/${sourcePageUrl}`}>
    <VulnerablePackage name={vulnerablePackageName} moreTotal={additionalVulnerabilitiesCount} />
  </Card>
);

export default ScansWithVulnerabilitiesCard;
