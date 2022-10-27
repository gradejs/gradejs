import React from 'react';
import styles from './SitesList.module.scss';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { getFaviconUrlByHostname } from 'utils/helpers';

export type Site = {
  hostname?: string;
  hostnamePackagesCount?: number;
};

type Props = {
  sites: Site[];
  className?: string;
};

function Site({ hostname, hostnamePackagesCount }: Site) {
  return (
    <Link to={`/scan/${hostname}`}>
      <div className={styles.site}>
        <div className={styles.imageWrapper}>
          <img
            src={getFaviconUrlByHostname(hostname)}
            className={styles.image}
            loading='lazy'
            alt=''
          />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{hostname}</div>
          <div className={styles.subtitle}>{hostnamePackagesCount} packages</div>
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
          <Site key={site.hostname} {...site} />
        ))}
      </div>
    </div>
  );
}
