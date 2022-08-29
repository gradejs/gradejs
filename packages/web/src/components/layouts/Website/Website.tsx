/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import clsx from 'clsx';
import { SubmitHandler } from 'react-hook-form';
import { Header, Package, Section, PackageSkeleton } from 'components/ui';
import styles from './Website.module.scss';
import Filters, { FiltersState } from '../Filters/Filters';
import TagBadge from '../../ui/TagBadge/TagBadge';
import { trackCustomEvent } from '../../../services/analytics';
import { Api } from '../../../services/apiClient';
import { Icon } from '../../ui/Icon/Icon';

// TODO: Add plashechka
export type Props = {
  host: string;
  // highlights?: Array<{
  //   description: string;
  //   title: string;
  //   icon: string;
  // }>;
  isLoading: boolean;
  isPending: boolean;
  packages: Api.WebPagePackage[];
  vulnerabilities: Record<string, Api.Vulnerability[]>;
  webpages: Api.WebPage[];
  onFiltersApply: SubmitHandler<FiltersState>;
};

export default function Website({
  host,
  isLoading,
  isPending,
  packages,
  webpages,
  vulnerabilities,
  onFiltersApply,
}: Props) {
  const [view, setView] = useState<'grid' | 'lines'>('grid');

  return (
    <>
      <Header />
      <Section>
        <h1 className={styles.heading}>{host}</h1>

        {isPending ? (
          <div className={clsx(styles.disclaimer, styles.disclaimerLoading)}>
            GradeJS is currently processing this website. <br />
            It may take a few minutes and depends on the number of JavaScript files and their size.
          </div>
        ) : (
          webpages.length > 0 && (
            <div className={styles.disclaimer}>
              The <strong>beta</strong> version of GradeJS is able to detect only 1,826 popular
              packages with up to 85% accuracy.
              <br />
              <a
                href='https://github.com/gradejs/gradejs/discussions/8'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.disclaimerLink}
              >
                Learn more about accuracy
              </a>{' '}
              or{' '}
              <a
                href='https://github.com/gradejs/gradejs/issues'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.disclaimerLink}
              >
                submit an issue
              </a>
              .
            </div>
          )
        )}

        <div className={styles.disclaimer}>
          Packages that are known to be vulnerable are now highlighted with{' '}
          <TagBadge color='red'>Vulnerable</TagBadge> badge. You can view detailed information on
          related vulnerabilities by hovering over the badge.
        </div>

        {/* <div className={styles.highlights}>
          {highlights.map((data, index) => (
            <HighlightTech key={index.toString()} {...data} />
          ))}
        </div> */}

        {!isLoading && (
          <div className={styles.packagesHeading}>
            NPM packages
            <span className={styles.packagesTotal}>({packages.length})</span>
            <Filters onSubmit={onFiltersApply} />
            <Icon
              kind={'lines'}
              className={styles.viewSelect}
              color={view === 'lines' ? '#0F0F0F' : '#E6E6E6'}
              onClick={() => {
                trackCustomEvent('HostnamePage', 'SetViewLines');
                setView('lines');
              }}
            />
            <Icon
              kind={'grid'}
              className={styles.viewSelect}
              color={view === 'grid' ? '#0F0F0F' : '#E6E6E6'}
              onClick={() => {
                trackCustomEvent('HostnamePage', 'SetViewGrid');
                setView('grid');
              }}
            />
          </div>
        )}
        <div className={clsx(styles.packages, styles[view])}>
          {packages.map((data, index) => (
            <Package
              key={index.toString()}
              variant={view}
              className={styles.package}
              pkg={data}
              vulnerabilities={vulnerabilities[data.packageName] || []}
            />
          ))}
          {isLoading && (
            <>
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
              <PackageSkeleton className={styles.package} />
            </>
          )}
        </div>
      </Section>
    </>
  );
}
