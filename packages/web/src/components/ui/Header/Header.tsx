/* eslint-disable react/button-has-type */
import React from 'react';
import clsx from 'clsx';
import Logo from '../Logo/Logo';
import styles from './Header.module.scss';
import { trackCustomEvent } from '../../../services/analytics';

export default function Header() {
  return (
    <header className={styles.container}>
      <Logo />
      <div className={styles.nav}>
        <a
          href='https://github.com/gradejs/gradejs/discussions/6'
          target='_blank'
          rel='norefferer noreferrer'
          className={styles.navLink}
          onClick={() => trackCustomEvent('ClickExternalLink', 'About')}
        >
          About
        </a>
        <a
          href='https://github.com/gradejs/gradejs/discussions'
          target='_blank'
          rel='norefferer noreferrer'
          className={styles.navLink}
          onClick={() => trackCustomEvent('ClickExternalLink', 'Community')}
        >
          Community
        </a>
        <a
          href='https://github.com/gradejs/gradejs'
          target='_blank'
          rel='norefferer noreferrer'
          className={clsx(styles.navLink, styles.githubButton)}
          onClick={() => trackCustomEvent('ClickExternalLink', 'SourceCode')}
        >
          Source Code
        </a>
      </div>
    </header>
  );
}
