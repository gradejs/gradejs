/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import clsx from 'clsx';
import { Header, Package, Section, PackageSkeleton } from 'components/ui';
import { Grid, Lines } from 'components/icons';
import styles from './Website.module.scss';
import type { DetectedPackageData } from '../../ui/Package/Package';

export type Props = {
  host: string;
  // highlights?: Array<{
  //   description: string;
  //   title: string;
  //   icon: string;
  // }>;
  packages: DetectedPackageData[];
  webpages: Array<{
    status: string;
  }>;
};

export default function Website({ host, packages, webpages }: Props) {
  const [view, setView] = useState<'grid' | 'lines'>('grid');
  const isPending = !!webpages.find((item) => item.status === 'pending');
  const isLoading = packages.length === 0;

  return (
    <>
      <Header />
      <Section>
        <h1 className={styles.heading}>{host}</h1>

        {webpages.length > 0 &&
          (isPending ? (
            <div className={clsx(styles.disclaimer, styles.disclaimerLoading)}>
              GradeJS is currently processing this website. <br />
              It may take a few minutes and depends on the number of JavaScript files and their
              size.
            </div>
          ) : (
            <div className={styles.disclaimer}>
              The <strong>beta</strong> version of GradeJS is able to detect only 1,826 popular
              packages with up to 85% accuracy.
              <br />
              <a
                href='https://github.com/fingerprintjs/gradejs/discussions/8'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.disclaimerLink}
              >
                Learn more about accuracy
              </a>{' '}
              or{' '}
              <a
                href='https://github.com/fingerprintjs/gradejs/issues'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.disclaimerLink}
              >
                submit an issue
              </a>
              .
            </div>
          ))}

        {/* <div className={styles.highlights}>
          {highlights.map((data, index) => (
            <HighlightTech key={index.toString()} {...data} />
          ))}
        </div> */}

        {!isLoading && (
          <div className={styles.packagesHeading}>
            NPM packages
            <span className={styles.packagesTotal}>({packages.length})</span>
            <Lines
              className={styles.viewSelect}
              color={view === 'lines' ? '#0F0F0F' : '#E6E6E6'}
              onClick={() => setView('lines')}
            />
            <Grid
              className={styles.viewSelect}
              color={view === 'grid' ? '#0F0F0F' : '#E6E6E6'}
              onClick={() => setView('grid')}
            />
          </div>
        )}
        <div className={clsx(styles.packages, styles[view])}>
          {packages.map((data, index) => (
            <Package key={index.toString()} variant={view} className={styles.package} pkg={data} />
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
