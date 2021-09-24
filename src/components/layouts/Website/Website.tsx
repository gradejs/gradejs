/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import clsx from 'clsx';
import { Header, HighlightTech, Package, Section } from 'components/ui';
import { Grid, Lines } from 'components/icons';
import styles from './Website.module.scss';

export type Props = {
  host: string;
  highlights: Array<{
    description: string;
    title: string;
    icon: string;
  }>;
  packages: Array<{
    name: string;
    version: string;
  }>;
};

export default function Website({ host, highlights, packages }: Props) {
  const [view, setView] = useState<'grid' | 'lines'>('grid');

  return (
    <>
      <Header />
      <Section>
        <div className={styles.disclaimer}>
          This is an early-alpha version so the output result may be incorrect. Help us improve the
          solution by{' '}
          <a
            href='https://github.com/fingerprintjs/gradejs/issues'
            target='_blank'
            rel='noopener noreferrer'
          >
            submitting a bug
          </a>
          .
        </div>
        <h1 className={styles.heading}>{host}</h1>

        <div className={styles.highlights}>
          {highlights.map((data, index) => (
            <HighlightTech key={index.toString()} {...data} />
          ))}
        </div>

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
        <div className={clsx(styles.packages, styles[view])}>
          {packages.map((data, index) => (
            <Package key={index.toString()} variant={view} className={styles.package} {...data} />
          ))}
        </div>
      </Section>
    </>
  );
}
