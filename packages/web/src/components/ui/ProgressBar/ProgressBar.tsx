import React, { useMemo } from 'react';
import styles from './ProgressBar.module.scss';

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  const widthStyle = useMemo(() => {
    return {
      width: `${progress}%`,
    };
  }, [progress]);

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarPercentage} style={widthStyle} />
      </div>
      <div className={styles.progressBarValue}>{progress}%</div>
    </div>
  );
};

export default ProgressBar;
