import React from 'react';
import styles from './HeaderNew.module.scss';
import Container from '../Container/Container';
import { Github, Logo } from 'components/icons';
import { trackCustomEvent } from '../../../services/analytics';

export default function HeaderNew() {
  return (
    <Container>
      <header className={styles.header}>
        <Logo className={styles.logo} />
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
            className={styles.githubLink}
            onClick={() => trackCustomEvent('ClickExternalLink', 'SourceCode')}
          >
            <Github className={styles.githubIcon} width='32' height='32' color='#fff' />
          </a>
        </div>
      </header>
    </Container>
  );
}