/* eslint-disable react/button-has-type */
import React from 'react';
import { Button, Header, Section } from 'components/ui';
import styles from './Error.module.scss';

export type Props = {
  host: string;
  message?: string;
  action?: string;
  actionTitle?: string;
  onRetry: () => unknown;
};

export default function Error({
  host,
  onRetry,
  message = 'Unfortunately, something went wrong.',
  action = 'Would you like to retry or report an issue?',
  actionTitle = 'Try again',
}: Props) {
  return (
    <>
      <Header />
      <Section>
        <h1 className={styles.heading}>{host}</h1>
        <p className={styles.primary}>{message}</p>
        <p className={styles.secondary}>{action}</p>
        <Button onClick={onRetry} className={styles.retry}>
          {actionTitle}
        </Button>
        <a href='https://github.com/gradejs/gradejs/issues' target='_blank' rel='noreferrer'>
          <Button className={styles.button} variant='action'>
            Report an issue
          </Button>
        </a>
      </Section>
    </>
  );
}
