import React from 'react';
import styles from './Hero.module.scss';
import Container from '../Container/Container';
import Chip from '../Chip/Chip';
import Header from '../Header/Header';
import { Icon } from '../Icon/Icon';

export type HeroProps = {
  inputText?: string;
  loading?: boolean;
  suggestions: string[];
};

export default function Hero({ inputText, suggestions, loading = false }: HeroProps) {
  return (
    <section className={styles.hero}>
      <Header variant='homepage' />

      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>Analyze webpack production bundle</h1>
          <p className={styles.subtitle}>
            GradeJS will analyze production JavaScript files and match webpack bundled modules to
            1,826 indexed NPM libraries over 54,735 releases
          </p>

          <div className={styles.search}>
            <input
              type='text'
              className={styles.input}
              value={inputText}
              placeholder='Start analyzing...'
            />
            <button type='submit' className={styles.submit}>
              {/* TODO: use SVG loading component */}
              {!loading ? (
                <Icon
                  kind='arrow'
                  className={styles.submitIcon}
                  width={32}
                  height={32}
                  color='#fff'
                />
              ) : (
                <span className={styles.loader} />
              )}
            </button>
          </div>

          <div className={styles.suggestions}>
            {suggestions.map((suggestion) => (
              <Chip key={suggestion} variant='suggest' size='medium'>
                {suggestion}
              </Chip>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
