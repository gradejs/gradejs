import React from 'react';
import styles from './PackageVersion.module.scss';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import { formatNumber, getReadableSizeString } from 'utils/helpers';

// Note: Modules/entrypoints typings and related code have been removed
// in https://github.com/gradejs/gradejs/pull/111/ - use as reference

type Props = {
  version: string;
  updateDate?: string;
  uses?: number;
  size?: number;
  modulesCount?: number;
  isVulnerable?: boolean;
};

const PackageVersion = ({ version, updateDate, uses, size, modulesCount, isVulnerable }: Props) => {
  return (
    <div className={clsx(styles.package)}>
      <div className={styles.packageTop}>
        <div className={styles.packageTopContent}>
          <div className={clsx(styles.packageTopCol, styles.packageVersion)}>
            <span className={styles.packageTitle}>
              {version}{' '}
              {isVulnerable && (
                <Icon kind='bugOutlined' color='#212121' className={styles.packageVersionBug} />
              )}
            </span>
            <span className={styles.packageSubtitle}>{updateDate}</span>
          </div>
          {!!uses && (
            <div
              className={clsx(
                styles.packageTopCol,
                styles.packageTopColMinor,
                styles.packageTopColSites
              )}
            >
              <span className={styles.packageTitle}>{formatNumber(uses)}</span>
              <span className={styles.packageSubtitle}>Sites used</span>
            </div>
          )}
          {!!size && (
            <div
              className={clsx(
                styles.packageTopCol,
                styles.packageTopColMinor,
                styles.packageTopColSize
              )}
            >
              <span className={styles.packageTitle}>{getReadableSizeString(size)}</span>
              <span className={styles.packageSubtitle}>
                <span className={styles.mobileHidden}>Total size</span>
              </span>
            </div>
          )}
          {!!modulesCount && (
            <div
              className={clsx(
                styles.packageTopCol,
                styles.packageTopColMinor,
                styles.packageTopColModules
              )}
            >
              <span className={styles.packageTitle}>{formatNumber(modulesCount)}</span>
              <span className={styles.packageSubtitle}>Modules</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageVersion;
