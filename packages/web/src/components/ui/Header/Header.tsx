import React from 'react';
import styles from './Header.module.scss';
import Container from '../Container/Container';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import { trackCustomEvent } from '../../../services/analytics';

type Props = {
  variant?: 'default' | 'homepage';
  children?: React.ReactNode;
};

export default function Header({ variant = 'default', children }: Props) {
  return (
    <Container>
      <header className={clsx(styles.header, styles[variant])}>
        <a href='/' className={styles.logo}>
          <Icon
            kind='logo'
            width={129}
            height={25}
            color={variant === 'default' ? '#212121' : 'white'}
          />
        </a>

        <div className={styles.searchWrapper}>{children}</div>

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
              color={variant === 'default' ? '#212121' : 'white'}
            />
          </a>
        </div>
      </header>
    </Container>
  );
}
