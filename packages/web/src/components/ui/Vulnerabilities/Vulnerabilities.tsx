import React from 'react';
import styles from './Vulnerabilities.module.scss';
import { ClientApi } from '../../../services/apiClient';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';
import { GithubAdvisorySeverity } from '@gradejs-public/shared';

export type Props = {
  vulnerabilities: ClientApi.PackageVulnerabilityResponse[];
};

const SeverityLabelMapping: Record<GithubAdvisorySeverity, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MODERATE: 'Moderate',
  LOW: 'Low',
};

export default function Vulnerabilities({ vulnerabilities }: Props) {
  return (
    <div className={styles.vulnerabilities}>
      {vulnerabilities.map(({ severity, summary, affectedVersionRange, osvId, detailsUrl }) => (
        <div key={osvId} className={styles.vulnerability}>
          <div className={styles.vulnerabilityTop}>
            <Chip
              variant='vulnerabilities'
              size='badge'
              fontWeight='semiBold'
              icon={<Icon kind='vulnerability' width={24} height={24} color='white' />}
            >
              {(severity && SeverityLabelMapping[severity]) ?? 'Unknown'}
            </Chip>
            {
              <a
                href={detailsUrl}
                target='_blank'
                rel='noreferrer'
                className={styles.vulnerabilityLink}
              >
                {osvId}
              </a>
            }
          </div>
          <div className={styles.vulnerabilityTitle}>{summary}</div>
          <div className={styles.vulnerabilityText}>Affected versions {affectedVersionRange}</div>
        </div>
      ))}
    </div>
  );
}
