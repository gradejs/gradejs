/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import React from 'react';
import semver from 'semver';
import styles from './Package.module.scss';
import Dropdown from '../Dropdown/Dropdown';
import Vulnerability from '../Vulnerability/Vulnerability';
import TagBadge from '../TagBadge/TagBadge';
import { trackCustomEvent } from '../../../services/analytics';
import { ClientApi } from '../../../services/apiClient';
import { Icon } from '../Icon/Icon';

export type Props = {
  className?: string;
  variant?: 'grid' | 'lines';
  pkg: ClientApi.ScanResultPackageResponse;
  vulnerabilities: ClientApi.PackageVulnerabilityResponse[];
};

export default function Package({ className, variant = 'grid', pkg, vulnerabilities }: Props) {
  const repositoryUrl = pkg.registryMetadata?.repositoryUrl;
  const homepageUrl = pkg.registryMetadata?.homepageUrl;
  const isOutdated =
    pkg.registryMetadata && semver.gtr(pkg.registryMetadata.latestVersion, pkg.versionRange);
  const isVulnerable = !!vulnerabilities?.length;

  return (
    <div className={clsx(styles.container, styles[variant], className)}>
      <div className={styles.registryMeta}>
        <div className={styles.packageTags}>
          {isVulnerable && (
            <Dropdown
              TriggerComponent={(props) => (
                <span className={styles.tagContainer}>
                  <TagBadge color='red' {...props}>
                    Vulnerable
                  </TagBadge>
                </span>
              )}
              triggerType='hover'
              position='bottomleft'
              onOpen={() => trackCustomEvent('Package', 'ShowVulnerabilitiesTooltip')}
            >
              <div className={styles.vulnerabilityTooltip}>
                {vulnerabilities.map((it) => (
                  <Vulnerability key={it.osvId} vulnerability={it} />
                ))}
              </div>
            </Dropdown>
          )}
          {isOutdated && (
            <span className={styles.tagContainer}>
              <TagBadge color='yellow'>Outdated</TagBadge>
            </span>
          )}
        </div>
        <div className={styles.externalLinks}>
          {repositoryUrl && (
            <a
              href={repositoryUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackCustomEvent('Package', 'ClickRepoUrl')}
              className={styles.externalLink}
            >
              <Icon kind='githubLogo' width={19} height={19} />
            </a>
          )}
          {homepageUrl && homepageUrl !== repositoryUrl && (
            <a
              href={homepageUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackCustomEvent('Package', 'ClickHomepageUrl')}
              className={styles.externalLink}
            >
              <Icon kind='external' width={19} height={19} />
            </a>
          )}
        </div>
      </div>
      <a
        className={styles.name}
        href={`https://www.npmjs.com/package/${pkg.name}`}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={pkg.name}
        // Browser won't break a line for '/' symbol, so we add the <wbr> specificaly
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: pkg.name.replace('/', '/<wbr>') }}
        onClick={() => trackCustomEvent('Package', 'ClickPackageUrl')}
      />
      <div className={styles.meta}>
        <div className={styles.version}>{toReadableVersion(pkg.versionRange)}</div>
        {!!pkg.approximateByteSize && (
          <span className={styles.size}>{toReadableSize(pkg.approximateByteSize)}</span>
        )}
      </div>
    </div>
  );
}

const byteUnits = ['B', 'KB', 'MB'];
function toReadableSize(size: number) {
  let byteUnitIndex = 0;
  let sizeInUnits = size;

  while (sizeInUnits > 1024) {
    sizeInUnits /= 1024;
    byteUnitIndex += 1;
  }

  // parseFloat(X.toFixed(1)) removes a zero fraction
  return `${parseFloat(sizeInUnits.toFixed(1))}${byteUnits[byteUnitIndex]}`;
}

function toReadableVersion(version: string) {
  if (version === '*') {
    return 'Unknown version';
  }

  return version;
}
