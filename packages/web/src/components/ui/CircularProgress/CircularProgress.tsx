import React, { useMemo } from 'react';
import styles from './CircularProgress.module.scss';

type Props = {
  progress: number;
  size?: number;
  strokeWidth?: number;
};

const CircularProgress = ({ progress, size = 48, strokeWidth = 5 }: Props) => {
  const circleStyle = useMemo(() => {
    const sizeWithTrack = size + strokeWidth;
    const center = sizeWithTrack / 2;
    const radius = center - strokeWidth;

    const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
    const numberedStrokeDashoffset = circumference * ((100 - progress) / 100);
    const strokeDasharray = circumference.toFixed(3);
    const strokeDashoffset = `${numberedStrokeDashoffset.toFixed(3)}px`;

    return {
      sizeWithTrack,
      center,
      radius,
      strokeDasharray,
      strokeDashoffset,
    };
  }, [progress, size, strokeWidth]);

  const wrapperStyle = useMemo(() => {
    return {
      width: size,
      height: size,
    };
  }, [size]);

  const { sizeWithTrack, center, radius, strokeDasharray, strokeDashoffset } = circleStyle;

  return (
    <div className={styles.circularProgress}>
      <span className={styles.circularProgressWrapper} style={wrapperStyle}>
        <svg
          className={styles.circularProgressSvg}
          viewBox={`${center} ${center} ${sizeWithTrack} ${sizeWithTrack}`}
        >
          <circle
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
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
