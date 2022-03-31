/* eslint-disable react/button-has-type */
import React from 'react';
import { Button, Header, Section } from 'components/ui';
import styles from './Error.module.scss';

export type Props = {
  host: string;
  onRetry: () => unknown;
};

export default function Error({ host, onRetry }: Props) {
  return (
    <>
      <Header />
      <Section>
        <h1 className={styles.heading}>{host}</h1>
        <p className={styles.primary}>Unfortunately, we couldn’t detect any NPM packages</p>
        <p className={styles.secondary}>Would you like to send an error report to us?</p>
        <Button onClick={onRetry}>Retry</Button>
        <a href='https://github.com/fingerprintjs/gradejs/issues' target='_blank' rel='noreferrer'>
          <Button className={styles.button} variant='action'>
            Send
          </Button>
        </a>
      </Section>
    </>
  );
}
