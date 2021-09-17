/* eslint-disable react/button-has-type */
import React from 'react';
import { Header, HighlightTech, Package, Section } from 'components/ui';
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
  return (
    <>
      <Header />
      <Section>
        <h1 className={styles.heading}>{host}</h1>

        <div className={styles.highlights}>
          {highlights.map((data, index) => (
            <HighlightTech key={index.toString()} {...data} />
          ))}
        </div>

        <div className={styles.packages}>
          {packages.map((data, index) => (
            <Package key={index.toString()} className={styles.package} {...data} />
          ))}
        </div>
      </Section>
    </>
  );
}
