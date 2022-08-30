import React from 'react';
import styles from './ChipGroup.module.scss';
import Chip, { ChipProps } from '../Chip/Chip';

type Props = {
  chips: string[];
  children?: React.ReactNode;
  size?: ChipProps['size'];
  font?: ChipProps['font'];
};

// TODO: allow Chip customizing with props
export default function ChipGroup({ chips, children, size = 'medium', font = 'monospace' }: Props) {
  return (
    <div className={styles.chipsWrapper}>
      <div className={styles.chips}>
        {chips.map((chip) => (
          <Chip key={chip} className={styles.chip} size={size} font={font}>
            {chip}
          </Chip>
        ))}

        {children}
      </div>
    </div>
  );
}
