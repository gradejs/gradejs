import React, { useMemo } from 'react';
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
  const trackAboutClick = useMemo(() => {
    return () => trackCustomEvent('ClickExternalLink', 'About');
  }, []);

  const trackAboutCommunity = useMemo(() => {
    return () => trackCustomEvent('ClickExternalLink', 'Community');
  }, []);

  const trackAboutSourceCode = useMemo(() => {
    return () => trackCustomEvent('ClickExternalLink', 'SourceCode');
  }, []);

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
            onClick={trackAboutClick}
          >
            About
          </a>
          <a
            href='https://github.com/gradejs/gradejs/discussions'
            target='_blank'
            rel='noreferrer'
            className={styles.navLink}
            onClick={trackAboutCommunity}
          >
            Community
          </a>
          <a
            href='https://github.com/gradejs/gradejs'
            target='_blank'
            rel='noreferrer'
            className={styles.navLink}
            onClick={trackAboutSourceCode}
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
