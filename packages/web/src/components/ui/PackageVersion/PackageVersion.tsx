import React, { useState } from 'react';
import styles from './PackageVersion.module.scss';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import CircularProgress from '../CircularProgress/CircularProgress';
import ProgressBar from '../ProgressBar/ProgressBar';
import { formatNumber, getReadableSizeString } from 'utils/helpers';

type Module = {
  path: string;
  moduleSize: number;
  moduleSizeUnit: string;
  percentage: number;
};

type EntryPoint = {
  value: number;
  code: string;
  entry: string;
};

type Props = {
  version: string;
  updateDate?: string;
  uses?: number;
  size?: number;
  modulesCount?: number;
  modules: Module[];
  entries: EntryPoint[];
  opened?: boolean;
};

const PackageVersion = ({
  version,
  updateDate,
  uses,
  size,
  modulesCount,
  modules,
  entries,
  opened = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(opened);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={clsx(styles.package, isOpen && styles.packageOpen)}>
      <div className={styles.packageTop} onClick={toggleOpen}>
        <div className={styles.packageTopContent}>
          <div className={clsx(styles.packageTopCol, styles.packageVersion)}>
            <span className={styles.packageTitle}>
              {version}{' '}
              <Icon kind='bugOutlined' color='#212121' className={styles.packageVersionBug} />
            </span>
            <span className={styles.packageSubtitle}>{updateDate}</span>
          </div>
          {uses && (
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
          {size && (
            <div
              className={clsx(
                styles.packageTopCol,
                styles.packageTopColMinor,
                styles.packageTopColSize
              )}
            >
              <span className={styles.packageTitle}>{getReadableSizeString(size)}</span>
              <span className={styles.packageSubtitle}>
                <span className={styles.mobileHidden}>Footprint</span>
              </span>
            </div>
          )}
          {modulesCount && (
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

        <button className={styles.packageArrowButton}>
          <Icon kind='chevronDown' width={14} height={8} color='#8E8AA0' className={styles.arrow} />
        </button>
      </div>

      <div className={styles.packageContentWrapper}>
        <div className={styles.packageContent}>
          <div className={styles.packageContentCol}>
            <div className={styles.packageContentTitle}>
              <Icon
                kind='modules'
                width={14}
                height={14}
                className={styles.packageContentTitleIcon}
              />
              Modules
            </div>

            <div className={styles.packageModules}>
              {modules.map(({ path, moduleSize, moduleSizeUnit, percentage }, idx) => (
                // TODO: fix key from map
                <div key={idx} className={styles.packageModule}>
                  <div className={styles.packageModuleTop}>
                    <div className={styles.packageModulePath}>{path}</div>
                    <div className={styles.packageModuleSize}>
                      {formatNumber(moduleSize)} {moduleSizeUnit}
                    </div>
                  </div>
                  <ProgressBar progress={percentage} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.packageContentCol}>
            <div className={styles.packageContentTitle}>
              <Icon
                kind='entry'
                width={12}
                height={14}
                className={styles.packageContentTitleIcon}
              />
              Entry point export
            </div>

            <div className={styles.entryPoints}>
              {entries.map(({ value, code, entry }, idx) => (
                <div key={idx} className={styles.entryPoint}>
                  <div className={styles.entryPointCircle}>
                    <CircularProgress progress={value} />
                  </div>
                  <div className={styles.entryPointContent}>
                    <div className={styles.entryPointTitle}>{code}</div>
                    <div className={styles.entryPointSubtitle}>{entry}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageVersion;
