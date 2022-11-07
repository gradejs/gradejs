import React from 'react';
import styles from './Hero.module.scss';
import Container from '../Container/Container';
import Chip from '../Chip/Chip';
import DefaultHeader from '../Header/DefaultHeader';
import { Link } from 'react-router-dom';
import SearchBarContainer from '../../containers/SearchBarContainer';

export type HeroProps = {
  suggestions?: string[];
};

export default function Hero({ suggestions }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.headerWrapper}>
        <DefaultHeader showSearchOverlay={false} variant='light' />
      </div>

      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>Analyze webpack production bundle</h1>
          <p className={styles.subtitle}>
            GradeJS analyzes production JavaScript files and detects bundled modules and third-party
            packages. It works even for tree-shaken bundles and without access to the source code of
            a website or webpack stats files.
          </p>

          <div className={styles.search}>
            <SearchBarContainer size='large' variant='hero' />
          </div>

          {suggestions && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <Link key={suggestion} to={`/scan/${suggestion}`}>
                  <Chip title={suggestion} size='medium' variant='suggest'>
                    {suggestion}
                  </Chip>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
