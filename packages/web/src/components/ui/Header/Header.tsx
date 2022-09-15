import React from 'react';
import styles from './Header.module.scss';
import Container from '../Container/Container';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import SearchBar from '../SearchBar/SearchBar';

export type Props = {
  variant?: 'default' | 'light';
  showSearch?: boolean;
  children?: React.ReactNode;
};

export default function Header({ variant = 'default', showSearch = false, children }: Props) {
  return (
    <Container>
      <header className={clsx(styles.header, showSearch && styles.showSearch, styles[variant])}>
        {/* TODO: add Link from react router */}
        <a href='/' className={styles.logo}>
          <Icon
            kind='logo'
            width={129}
            height={25}
            color={variant === 'light' ? 'white' : '#212121'}
          />
        </a>

        {showSearch && (
          <div className={styles.searchWrapper}>
            <SearchBar />
          </div>
        )}

        <div className={styles.nav}>{children}</div>
      </header>
    </Container>
  );
}
