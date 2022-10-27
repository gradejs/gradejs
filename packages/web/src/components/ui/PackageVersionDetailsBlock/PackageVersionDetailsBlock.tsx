import React from 'react';
import styles from './PackageVersionDetailsBlock.module.scss';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import { formatNumber, getReadableSizeString, plural } from 'utils/helpers';

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

const PackageVersionDetailsBlock = ({
  version,
  updateDate,
  uses,
  size,
  modulesCount,
  isVulnerable,
}: Props) => {
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

          <div
            className={clsx(
              styles.packageTopCol,
              styles.packageTopColMinor,
              styles.packageTopColSites
            )}
          >
            {!!uses && (
              <>
                <span className={styles.packageTitle}>{formatNumber(uses)}</span>
                <span className={styles.packageSubtitle}>
                  {plural(uses, 'Website', 'Websites', false)}
                </span>
              </>
            )}
          </div>

          <div
            className={clsx(
              styles.packageTopCol,
              styles.packageTopColMinor,
              styles.packageTopColSize
            )}
          >
            {!!size && (
              <>
                <span className={styles.packageTitle}>{getReadableSizeString(size)}</span>
                <span className={styles.packageSubtitle}>Unpacked size</span>
              </>
            )}
          </div>

          <div
            className={clsx(
              styles.packageTopCol,
              styles.packageTopColMinor,
              styles.packageTopColModules
            )}
          >
            {!!modulesCount && (
              <>
                <span className={styles.packageTitle}>{formatNumber(modulesCount)}</span>
                <span className={styles.packageSubtitle}>
                  {plural(modulesCount, 'Module', 'Modules', false)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageVersionDetailsBlock;
