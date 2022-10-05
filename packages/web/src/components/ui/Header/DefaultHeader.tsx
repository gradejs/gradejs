import React, { useMemo } from 'react';
import styles from './Header.module.scss';
import { Icon } from '../Icon/Icon';
import Header, { Props } from './Header';
import { trackCustomEvent } from '../../../services/analytics';

export default function DefaultHeader(props: Props) {
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
    <Header {...props}>
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
          color={props.variant === 'light' ? 'white' : '#212121'}
        />
      </a>
    </Header>
  );
}
