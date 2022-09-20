import React from 'react';
import styles from './Header.module.scss';
import { Props } from './Header';
import { useScrollPosition } from 'hooks/useScrollPosition';
import clsx from 'clsx';
import DefaultHeader from './DefaultHeader';

export default function StickyDefaultHeader(props: Props) {
  const scrollPosition = useScrollPosition();

  return <DefaultHeader className={clsx(scrollPosition > 0 && styles.shadow)} {...props} />;
}
