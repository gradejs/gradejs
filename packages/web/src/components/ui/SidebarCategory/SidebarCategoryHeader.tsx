import React from 'react';
import styles from './SidebarCategory.module.scss';
import clsx from 'clsx';
import { Icon } from '../Icon/Icon';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';

type Props = {
  returnButton?: () => void;
  categoryName: string;
  selectedKeywords?: string[];
  resetGroup?: () => void;
  children?: React.ReactNode;
};

export default function SidebarCategoryHeader({
  returnButton,
  categoryName,
  selectedKeywords,
  resetGroup,
  children,
}: Props) {
  return (
    <div className={styles.sidebarItemTop}>
      <div className={styles.sidebarItemTitle}>
        {returnButton && (
          <button className={styles.arrowBack} onClick={returnButton}>
            <Icon kind='arrowBack' width={18} height={16} color='#212121' />
          </button>
        )}
        {categoryName}
        {selectedKeywords && selectedKeywords.length > 0 && (
          <span className={styles.selectedCounter}>
            <Badge content={selectedKeywords.length} />
          </span>
        )}
        {selectedKeywords && resetGroup && (
          <div
            className={clsx(
              styles.localReset,
              selectedKeywords.length > 0 && styles.localResetVisible
            )}
          >
            <Button variant='secondary' size='small' onClick={resetGroup}>
              Reset
            </Button>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
