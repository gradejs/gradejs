import React from 'react';
import styles from './SitesList.module.scss';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export type Site = {
  id?: string;
  image?: string;
  name: string;
  packagesCount?: number;
};

type Props = {
  sites: Site[];
  className?: string;
};

function Site({ image, name, packagesCount }: Site) {
  return (
    <Link to={'/scan/' + name}>
      <div className={styles.site}>
        <div className={styles.imageWrapper}>
          {image && <img src={image} className={styles.image} loading='lazy' alt='' />}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{name}</div>
          <div className={styles.subtitle}>{packagesCount} packages</div>
        </div>
      </div>
    </Link>
  );
}

export default function SitesList({ sites, className }: Props) {
  return (
    <div className={styles.sitesListWrapper}>
      <div className={clsx(styles.sitesList, className)}>
        {sites.map((site) => (
          <Site key={site.id} {...site} />
        ))}
      </div>
    </div>
  );
}
