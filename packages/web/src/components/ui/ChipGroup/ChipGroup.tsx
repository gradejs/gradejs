import React from 'react';
import styles from './ChipGroup.module.scss';
import Chip from '../Chip/Chip';

type Props = {
  chips: string[];
  children?: React.ReactNode;
};

// TODO: allow Chip customizing with props
export default function ChipGroup({ chips, children }: Props) {
  return (
    <div className={styles.tagsWrapper}>
      <div className={styles.tags}>
        {chips.map((chip) => (
          <Chip key={chip} className={styles.tag} size='large' font='monospace'>
            {chip}
          </Chip>
        ))}

        {children}
      </div>
    </div>
  );
}
