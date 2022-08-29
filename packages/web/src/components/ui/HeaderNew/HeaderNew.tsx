import React from 'react';
import styles from './HeaderNew.module.scss';
import Container from '../Container/Container';
import { Icon } from '../Icon/Icon';
import { trackCustomEvent } from '../../../services/analytics';

export default function HeaderNew() {
  return (
    <Container>
      <header className={styles.header}>
        <a href='/' className={styles.logo}>
          <Icon kind='logo' width={129} height={25} color='white' />
        </a>
        <div className={styles.nav}>
          <a
            href='https://github.com/gradejs/gradejs/discussions/6'
            target='_blank'
            rel='noreferrer'
            className={styles.navLink}
            onClick={() => trackCustomEvent('ClickExternalLink', 'About')}
          >
            About
          </a>
          <a
            href='https://github.com/gradejs/gradejs/discussions'
            target='_blank'
            rel='noreferrer'
            className={styles.navLink}
            onClick={() => trackCustomEvent('ClickExternalLink', 'Community')}
          >
            Community
          </a>
          <a
            href='https://github.com/gradejs/gradejs'
            target='_blank'
            rel='noreferrer'
            className={styles.navLink}
            onClick={() => trackCustomEvent('ClickExternalLink', 'SourceCode')}
          >
            <Icon
              kind='githubLogo'
              className={styles.githubIcon}
              width={32}
              height={32}
              color='#fff'
            />
          </a>
        </div>
      </header>
    </Container>
  );
}
