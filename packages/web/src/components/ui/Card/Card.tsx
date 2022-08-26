import React from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';
import { numberWithSpaces } from '../../../utils/helpers';
import { Bug } from 'components/icons';
import Chip from '../Chip/Chip';

export type CardProps = {
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
  variant?: 'to-all' | 'vulnerable' | string;
};

export default function Card({
  title,
  icon,
  description,
  packageTags,
  featuredSites,
  vulnerablePackage,
  variant = '',
}: CardProps) {
  return (
    <div className={clsx(styles.card, styles[variant])}>
      <div className={styles.cardTop}>
        <header className={styles.header}>
          {icon && (
            <div className={styles.icon}>
              <img src={icon} alt='' />
            </div>
          )}

          <div className={styles.title}>{title}</div>
        </header>

        {description && <div className={styles.description}>{description}</div>}
      </div>

      {variant === 'toAll' && (
        <button className={styles.arrowBtn} type='button'>
          {/* TODO: properly import SVG arrow */}
          <svg
            width='24'
            height='25'
            viewBox='0 0 24 25'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M9 5.5L17 13L9 20.5'
              stroke='#212121'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      )}

      {packageTags && (
        <div className={styles.tagsWrapper}>
          <div className={styles.tags}>
            {packageTags.featuredPackages.map((tag) => (
              <Chip key={tag} size='large' font='monospace'>
                {tag}
              </Chip>
            ))}
            <Chip variant='outlined' size='large'>
              +{packageTags.restPackages} packages
            </Chip>
          </div>
        </div>
      )}

      {featuredSites && (
        <div className={styles.sitesWrapper}>
          <div className={styles.sites}>
            <div className={styles.sitesList}>
              {featuredSites.iconList.map((featuredSite) => (
                <div key={featuredSite} className={styles.sitesItem}>
                  <img src={featuredSite} alt='' />
                </div>
              ))}
            </div>

            <div className={styles.sitesCount}>
              + {numberWithSpaces(featuredSites.numberOfUses)} sites use
            </div>
          </div>
        </div>
      )}

      {vulnerablePackage && (
        <div className={styles.vulnerableWrapper}>
          <span className={styles.vulnerablePackage}>
            <span className={styles.vulnerableIcon}>
              <Bug width='28' height='28' />
            </span>
            {vulnerablePackage.name}
          </span>
          {vulnerablePackage.moreCount && (
            <span className={styles.vulnerableMore}>
              <Chip variant='secondary' size='medium'>
                +{vulnerablePackage.moreCount}
                &nbsp;
                <span className={styles.vulnerableMoreText}>more</span>
              </Chip>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
