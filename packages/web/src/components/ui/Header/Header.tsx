import React from 'react';
import styles from './Header.module.scss';
import clsx from 'clsx';
import Container from '../Container/Container';
import { Icon } from '../Icon/Icon';
import SearchBarContainer from '../../containers/SearchBarContainer';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import { selectSearchOpen } from '../../../store/selectors/search';
import { CSSTransition } from 'react-transition-group';

export type Props = {
  searchQuery?: string;
  variant?: 'default' | 'light';
  showSearch?: boolean;
  showSearchOverlay?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const overlayTransitionClassNames = {
  enter: styles.overlayEnter,
  enterActive: styles.overlayEnterActive,
  enterDone: styles.overlayEnterDone,
  exit: styles.overlayExit,
  exitActive: styles.overlayExitActive,
  exitDone: styles.overlayExitDone,
};

const SearchOverlay = ({ searchIsOpen }: { searchIsOpen: boolean }) => {
  return (
    <CSSTransition
      in={searchIsOpen}
      timeout={600}
      classNames={overlayTransitionClassNames}
      unmountOnExit
    >
      <div className={styles.headerSearchOverlay} />
    </CSSTransition>
  );
};

export default function Header({
  variant = 'default',
  searchQuery,
  className,
  showSearch = false,
  showSearchOverlay = true,
  children,
}: Props) {
  const searchIsOpen = useAppSelector(selectSearchOpen);

  return (
    <header className={clsx(styles.header, styles[variant], className)}>
      {showSearchOverlay && <SearchOverlay searchIsOpen={searchIsOpen} />}

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
