import React, { useMemo } from 'react';
import styles from './BarChart.module.scss';
import clsx from 'clsx';
import { formatNumber } from '../../../utils/helpers';
import { Icon } from '../Icon/Icon';

type Bar = {
  fill: string;
  uses: number;
  moduleVersion: string;
  vulnerabilities?: boolean;
  highlighted?: boolean;
};

type Props = {
  bars: Bar[];
};

const Bar = ({ fill, uses, moduleVersion, vulnerabilities, highlighted }: Bar) => {
  const memoizedFillHeight = useMemo(() => {
    return {
      height: fill,
    };
  }, [fill]);

  return (
    <div className={styles.popularityItemWrapper}>
      <div className={styles.popularityItem}>
        <div
          className={clsx(styles.popularityFill, highlighted && styles.popularityFillAccent)}
          style={memoizedFillHeight}
        >
          {formatNumber(uses)}
        </div>
      </div>

      <div className={styles.popularityVersion}>
        {moduleVersion}
        {vulnerabilities && (
          <Icon kind='bugOutlined' color='#212121' className={styles.popularityVersionIcon} />
        )}
      </div>
    </div>
  );
};

export default function BarChart({ bars }: Props) {
  return (
    <div className={styles.popularity}>
      {bars.map((bar) => (
        <Bar key={bar.uses} {...bar} />
      ))}
    </div>
  );
}
