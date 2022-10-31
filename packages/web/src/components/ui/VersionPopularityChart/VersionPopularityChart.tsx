import React from 'react';
import styles from './VersionPopularityChart.module.scss';
import clsx from 'clsx';
import { formatNumber } from '../../../utils/helpers';
import semver from 'semver';
import { Icon } from '../Icon/Icon';

type VersionValue = {
  uses: number;
  isVulnerable?: boolean;
};

type Props = {
  versionSpecificValues: Record<string, VersionValue>;
  highlightedVersionRange?: string;
  max?: number;
};

export default function VersionPopularityChart({
  highlightedVersionRange = '*',
  versionSpecificValues,
  max = 6,
}: Props) {
  const versions = Object.keys(versionSpecificValues);
  const displayedValues = Object.entries(versionSpecificValues).sort(sortEntryByUses).slice(0, max);
  const maxValue = Math.max(...displayedValues.map((it) => it[1].uses));

  const highlightedVersions = new Set<string>();
  versions.forEach((it) => {
    if (semver.satisfies(it, highlightedVersionRange)) {
      highlightedVersions.add(it);
    }
  });

  // Change the last displayed column if no highlighted shown
  if (
    highlightedVersionRange !== '*' &&
    !displayedValues.some((it) => semver.satisfies(it[0], highlightedVersionRange))
  ) {
    const maxSatisfying = semver.maxSatisfying(versions, highlightedVersionRange);

    if (maxSatisfying) {
      displayedValues.pop();
      displayedValues.push([maxSatisfying, versionSpecificValues[maxSatisfying]]);
    }
  }

  return (
    <div className={styles.container}>
      {displayedValues.map(([version, value]) => (
        <VersionBar
          key={version}
          isHighlighted={highlightedVersions.has(version)}
          maxValue={maxValue}
          version={version}
          {...value}
        />
      ))}
    </div>
  );
}

type VersionBarProps = VersionValue & {
  maxValue: number;
  version: string;
  isHighlighted: boolean;
};

function VersionBar({ version, uses, maxValue, isHighlighted, isVulnerable }: VersionBarProps) {
  const height = `${((uses / maxValue) * 100).toFixed(2)}%`;

  return (
    <div className={styles.barWrapper}>
      <div className={styles.barContainer}>
        <div
          className={clsx(styles.bar, { [styles.highlighted]: isHighlighted })}
          style={{ height }}
        >
          {formatNumber(uses)}
        </div>
      </div>

      <div className={styles.popularityVersion}>
        {version}
        {isVulnerable && (
          <Icon kind='bugOutlined' color='#212121' className={styles.popularityVersionIcon} />
        )}
      </div>
    </div>
  );
}

function sortEntryByUses(a: [string, VersionValue], b: [string, VersionValue]) {
  return b[1].uses - a[1].uses;
}
