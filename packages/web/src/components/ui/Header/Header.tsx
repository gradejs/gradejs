import React from 'react';
import styles from './Header.module.scss';
import clsx from 'clsx';
import Container from '../Container/Container';
import { Icon } from '../Icon/Icon';
import SearchBarContainer from '../../containers/SearchBarContainer';
import { Link } from 'react-router-dom';

export type Props = {
  searchQuery?: string;
  variant?: 'default' | 'light';
  showSearch?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function Header({
  variant = 'default',
  searchQuery,
  className,
  showSearch = false,
  children,
}: Props) {
  return (
    <header className={clsx(styles.header, styles[variant], className)}>
      <Container>
        <div className={clsx(styles.headerInner, showSearch && styles.showSearch)}>
          <Link to='/' className={styles.logo}>
            <Icon
              kind='logo'
              width={129}
              height={25}
              color={variant === 'light' ? 'white' : '#212121'}
            />
          </Link>

          {showSearch && (
            <div className={styles.searchWrapper}>
              <SearchBarContainer initialValue={searchQuery} />
            </div>
          )}

          <div className={styles.nav}>{children}</div>
        </div>
      </Container>
    </header>
  );
}
