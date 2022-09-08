import React from 'react';
import styles from './ChipGroup.module.scss';
import Chip, { ChipProps } from '../Chip/Chip';
import Skeleton from '../Skeleton/Skeleton';

type Props = {
  chips: string[];
  children?: React.ReactNode;
  size?: ChipProps['size'];
  font?: ChipProps['font'];
  fontSize?: ChipProps['fontSize'];
  loading?: boolean;
};

export default function ChipGroup({
  chips,
  children,
  size = 'medium',
  font = 'monospace',
  fontSize = 'regular',
  loading,
}: Props) {
  return (
    <div className={styles.chipsWrapper}>
      <div className={styles.chips}>
        {loading
          ? [...Array(4)].map((item, idx) => (
              <Skeleton key={idx} variant='rounded' className={styles.chip}>
                <Chip>Lorem ipsum</Chip>
              </Skeleton>
            ))
          : chips.map((chip) => (
              <Chip key={chip} className={styles.chip} size={size} font={font} fontSize={fontSize}>
                {chip}
              </Chip>
            ))}

        {children}
      </div>
    </div>
  );
}
