/* eslint-disable react/button-has-type */
import React from 'react';
import clsx from 'clsx';
import Logo from '../Logo/Logo';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <Logo />
      <div className={styles.nav}>
        <a
          href='https://github.com/fingerprintjs/gradejs/discussions'
          target='_blank'
          rel='norefferer noreferrer'
          className={styles.navLink}
        >
          About
        </a>
        <a
          href='https://github.com/fingerprintjs/gradejs/discussions'
          target='_blank'
          rel='norefferer noreferrer'
          className={styles.navLink}
        >
          Community
        </a>
        <a
          href='https://github.com/fingerprintjs/gradejs'
          target='_blank'
          rel='norefferer noreferrer'
          className={clsx(styles.navLink, styles.githubButton)}
        >
          Source Code
        </a>
      </div>
    </header>
  );
}
