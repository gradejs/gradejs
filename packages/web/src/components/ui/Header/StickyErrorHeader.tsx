import React from 'react';
import styles from './Header.module.scss';
import { Props } from './Header';
import { useScrollPosition } from 'hooks/useScrollPosition';
import clsx from 'clsx';
import ErrorHeader from './ErrorHeader';

export default function StickyErrorHeader(props: Props) {
  const scrollPosition = useScrollPosition();

  return <ErrorHeader className={clsx(scrollPosition > 0 && styles.shadow)} {...props} />;
}
