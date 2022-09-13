import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from './Header.module.scss';
import Header, { Props } from './Header';
import { trackCustomEvent } from '../../../services/analytics';

export default function ErrorHeader(props: Props) {
  const trackIssuesClick = useMemo(() => {
    return () => trackCustomEvent('ClickExternalLink', 'Issues');
  }, []);

  return (
    <Header {...props}>
      <a
        href='https://github.com/gradejs/gradejs/issues'
        target='_blank'
        rel='noreferrer'
        className={clsx(styles.navLink, styles.navLinkIssues)}
        onClick={trackIssuesClick}
      >
        Report an issue
      </a>
    </Header>
  );
}
