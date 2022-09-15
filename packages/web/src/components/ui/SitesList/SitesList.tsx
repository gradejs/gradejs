import React from 'react';
import styles from './SitesList.module.scss';
import clsx from 'clsx';
import { SitesListSkeleton } from './SitesListSkeleton';

export type Site = {
  id?: string;
  image?: string;
  name?: string;
  packagesCount?: number;
  loading?: boolean;
};

type Props = {
  sites: Site[];
  className?: string;
  loading?: boolean;
};

function Site({ image, name, packagesCount }: Site) {
  return (
    <div className={styles.site}>
      <div className={styles.imageWrapper}>
        <img src={image} className={styles.image} alt='' />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{name}</div>
        <div className={styles.subtitle}>{packagesCount} packages</div>
      </div>
    </div>
  );
}

export default function SitesList({ sites, className, loading }: Props) {
  return (
    <div className={styles.sitesListWrapper}>
      <div className={clsx(styles.sitesList, className)}>
        {loading ? <SitesListSkeleton /> : sites.map((site) => <Site key={site.id} {...site} />)}
      </div>
    </div>
  );
}
