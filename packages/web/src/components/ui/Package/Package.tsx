/* eslint-disable react/button-has-type */
import clsx from 'clsx';
import { External, Github } from 'components/icons';
import React from 'react';
import semver from 'semver';
import styles from './Package.module.scss';

export type DetectedPackageData = {
  packageName: string;
  possiblePackageVersions: string[];
  packageVersionRange: string;
  packageMetadata?: {
    approximateByteSize: number | null;
  };
  registryMetadata?: {
    latestVersion: string;
    description?: string;
    repositoryUrl?: string;
    homepageUrl?: string;
  };
};

export type Props = {
  className?: string;
  variant?: 'grid' | 'lines';
  pkg: DetectedPackageData;
};

export default function Package({ className, variant = 'grid', pkg }: Props) {
  const repositoryUrl = pkg.registryMetadata?.repositoryUrl;
  const homepageUrl = pkg.registryMetadata?.homepageUrl;
  const isOutdated =
    pkg.registryMetadata && semver.gtr(pkg.registryMetadata.latestVersion, pkg.packageVersionRange);

  return (
    <div className={clsx(styles.container, styles[variant], className)}>
      <div className={styles.registryMeta}>
        {isOutdated && <div className={styles.badge}>Outdated</div>}
        <div className={styles.externalLinks}>
          {repositoryUrl && (
            <a
              href={repositoryUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.externalLink}
            >
              <Github />
            </a>
          )}{' '}
          {homepageUrl && homepageUrl !== repositoryUrl && (
            <a
              href={homepageUrl}
              target='_blank'
              rel='noopener noreferrer'
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

  let readableSize = sizeInUnits.toFixed(1);
  if (readableSize.slice(-2) === '.0') {
    readableSize = readableSize.slice(0, -2);
  }

  return `${readableSize}${byteUnits[byteUnitIndex]}`;
}

function toReadableVersion(version: string) {
  if (version === '*') {
    return 'Unknown version';
  }

  return version;
}
