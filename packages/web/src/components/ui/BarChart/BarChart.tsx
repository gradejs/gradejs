import React, { useMemo } from 'react';
import styles from './BarChart.module.scss';
import clsx from 'clsx';
import { formatNumber } from '../../../utils/helpers';
import { Icon } from '../Icon/Icon';

type Bar = {
  fill: number; // expects a floating point number between 0 and 1
  uses: number;
  moduleVersion: string;
  vulnerabilities?: boolean;
  highlighted?: boolean;
};

type Props = {
  bars: Bar[];
};

const Bar = ({ fill, uses, moduleVersion, vulnerabilities, highlighted }: Bar) => {
  const fillHeightStyle = useMemo(() => {
    const normalizedFill = Math.max(Math.min(fill, 1), 0);

    return {
      height: `${normalizedFill * 100}%`,
    };
  }, [fill]);

  return (
    <div className={styles.popularityItemWrapper}>
      <div className={styles.popularityItem}>
        <div
          className={clsx(styles.popularityFill, highlighted && styles.popularityFillAccent)}
          style={fillHeightStyle}
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
