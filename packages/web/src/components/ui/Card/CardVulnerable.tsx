import React from 'react';
import CardCommon, { CardCommonProps } from './CardCommon';
import VulnerablePackage from '../VulnerablePackage/VulnerablePackage';

export interface CardVulnerableProps extends CardCommonProps {
  vulnerableName: string;
  vulnerableMore?: number;
}

const CardVulnerable = ({ title, vulnerableName, vulnerableMore }: CardVulnerableProps) => (
  <CardCommon title={title} variant='small'>
    <VulnerablePackage name={vulnerableName} moreTotal={vulnerableMore} />
  </CardCommon>
);

export default CardVulnerable;
