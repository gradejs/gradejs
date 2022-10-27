import React, { useState } from 'react';
import styles from './Hero.module.scss';
import Container from '../Container/Container';
import Chip from '../Chip/Chip';
import DefaultHeader from '../Header/DefaultHeader';
import { Icon } from '../Icon/Icon';
import { Link } from 'react-router-dom';

export type HeroProps = {
  loading?: boolean;
  suggestions?: string[];
  onSubmit?: (site: string) => void;
};

export default function Hero({ suggestions, onSubmit = () => {}, loading = false }: HeroProps) {
  const [inputText, setInputText] = useState('');

  return (
    <section className={styles.hero}>
      <div className={styles.headerWrapper}>
        <DefaultHeader variant='light' />
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
            <form
              onSubmit={(e) => {
                onSubmit(inputText);
                e.preventDefault();
                return false;
              }}
            >
              <input
                type='text'
                className={styles.input}
                value={inputText}
                onChange={(e) => setInputText(e.currentTarget.value)}
                placeholder='Enter a website URL...'
              />
              <button type='submit' className={styles.submit}>
                {/* TODO: use SVG loading component */}
                {!loading ? (
                  <Icon
                    kind='arrow'
                    className={styles.submitIcon}
                    width={14}
                    height={24}
                    color='#fff'
                  />
                ) : (
                  <span className={styles.loader} />
                )}
              </button>
            </form>
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
