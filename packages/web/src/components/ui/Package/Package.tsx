/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import { External, Github } from 'components/icons';
import React from 'react';
import semver from 'semver';
import styles from './Package.module.scss';
import Dropdown from '../Dropdown/Dropdown';
import Vulnerability from '../Vulnerability/Vulnerability';
import TagBadge from '../TagBadge/TagBadge';
import { trackCustomEvent } from '../../../services/analytics';
import { SyncWebsiteOutput } from '../../../services/apiClient';

export type Props = {
  className?: string;
  variant?: 'grid' | 'lines';
  pkg: SyncWebsiteOutput['packages'][number];
  vulnerabilities: SyncWebsiteOutput['vulnerabilities'][string];
};

export default function Package({ className, variant = 'grid', pkg, vulnerabilities }: Props) {
  const repositoryUrl = pkg.registryMetadata?.repositoryUrl;
  const homepageUrl = pkg.registryMetadata?.homepageUrl;
  const isOutdated =
    pkg.registryMetadata && semver.gtr(pkg.registryMetadata.latestVersion, pkg.packageVersionRange);
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
              <Github />
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
              <External />
            </a>
          )}
        </div>
      </div>
      <a
        className={styles.name}
        href={`https://www.npmjs.com/package/${pkg.packageName}`}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={pkg.packageName}
        // Browser won't break a line for '/' symbol, so we add the <wbr> specificaly
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: pkg.packageName.replace('/', '/<wbr>') }}
        onClick={() => trackCustomEvent('Package', 'ClickPackageUrl')}
      />
      <div className={styles.meta}>
        <div className={styles.version}>{toReadableVersion(pkg.packageVersionRange)}</div>
        {!!pkg.packageMetadata?.approximateByteSize && (
          <span className={styles.size}>
            {toReadableSize(pkg.packageMetadata.approximateByteSize)}
          </span>
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
