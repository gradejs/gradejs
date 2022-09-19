import React from 'react';
import CardCommon, { CardCommonProps } from './CardCommon';
import styles from './Card.module.scss';
import Chip from '../Chip/Chip';
import ChipGroup from '../ChipGroup/ChipGroup';

export interface CardChipsProps extends CardCommonProps {
  chips: string[];
  restPackages?: number;
}

const CardChips = ({ title, icon, chips, restPackages }: CardChipsProps) => {
  return (
    <CardCommon title={title} icon={icon}>
      <div className={styles.tagsWrapper}>
        <ChipGroup>
          {chips.map((chip) => (
            <Chip key={chip} className={styles.chip} size='large' font='monospace'>
              {chip}
            </Chip>
          ))}

          {restPackages && (
            <Chip className={styles.chip} size='large' variant='outlined'>
              +{restPackages} packages
            </Chip>
          )}
        </ChipGroup>
      </div>
    </CardCommon>
  );
};

export default CardChips;
