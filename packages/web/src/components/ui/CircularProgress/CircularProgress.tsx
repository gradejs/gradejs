import React, { useMemo } from 'react';
import styles from './CircularProgress.module.scss';

type Props = {
  progress: number;
  size?: number;
  strokeWidth?: number;
};

const CircularProgress = ({ progress, size = 48, strokeWidth = 5 }: Props) => {
  const sizeWithTrack = size + strokeWidth;
  const center = sizeWithTrack / 2;
  const radius = center - strokeWidth;

  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const strokeDashoffset = circumference * ((100 - progress) / 100);

  const circleStyle = useMemo(() => {
    return {
      strokeDasharray: circumference.toFixed(3),
      strokeDashoffset: `${strokeDashoffset.toFixed(3)}px`,
    };
  }, [progress, size, strokeWidth]);

  const wrapperStyle = useMemo(() => {
    return {
      width: size,
      height: size,
    };
  }, [size]);

  return (
    <div className={styles.circularProgress}>
      <span className={styles.circularProgressWrapper} style={wrapperStyle}>
        <svg
          className={styles.circularProgressSvg}
          viewBox={`${center} ${center} ${sizeWithTrack} ${sizeWithTrack}`}
        >
          <circle
            style={circleStyle}
            className={styles.circularProgressProgress}
            cx={sizeWithTrack}
            cy={sizeWithTrack}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            fill='none'
          />
        </svg>
      </span>

      <span className={styles.circularProgressContent}>{progress}</span>
    </div>
  );
};

export default CircularProgress;
