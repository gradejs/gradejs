import React from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';
import Chip from '../Chip/Chip';
import ChipGroup from '../ChipGroup/ChipGroup';
import AvatarGroup from '../AvatarGroup/AvatarGroup';
import VulnerablePackage from '../VulnerablePackage/VulnerablePackage';
import { Icon } from '../Icon/Icon';

export type CardProps = {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  packageTags?: {
    featuredPackages: string[];
    restPackages: number;
  };
  featuredSites?: {
    iconList: string[];
    numberOfUses: number;
  };
  vulnerablePackage?: {
    name: string;
    moreCount?: number;
  };
  variant?: 'toAll' | 'vulnerable';
};

export default function Card({
  title,
  icon,
  description,
  packageTags,
  featuredSites,
  vulnerablePackage,
  variant,
}: CardProps) {
  return (
    <div className={clsx(styles.card, variant && styles[variant])}>
      <div className={styles.cardTop}>
        <div className={styles.header}>
          {icon && (
            <div className={styles.iconWrapper}>
              <img className={styles.icon} src={icon} alt='' />
            </div>
          )}

          <div className={styles.title}>{title}</div>
        </div>

        {description && <div className={styles.description}>{description}</div>}
      </div>

      {variant === 'toAll' && (
        <button className={styles.arrowBtn} type='button'>
          <Icon kind='arrow' color='#212121' width={10} height={18} />
        </button>
      )}

      {packageTags && (
        <div className={styles.tagsWrapper}>
          <ChipGroup chips={packageTags.featuredPackages} size='large'>
            <Chip className={styles.tag} variant='outlined' size='large'>
              +{packageTags.restPackages} packages
            </Chip>
          </ChipGroup>
        </div>
      )}

      {featuredSites && (
        <AvatarGroup avatarGroup={featuredSites.iconList} counter={featuredSites.numberOfUses} />
      )}

      {vulnerablePackage && (
        <VulnerablePackage name={vulnerablePackage.name} moreTotal={vulnerablePackage.moreCount} />
      )}
    </div>
  );
}
