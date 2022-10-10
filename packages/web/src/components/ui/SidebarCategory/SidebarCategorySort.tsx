import React from 'react';
import styles from './SidebarCategory.module.scss';
import { Icon } from '../Icon/Icon';

type Props = {
  categoryName: string;
  returnButton?: () => void;
  resetGroup?: () => void;
  children?: React.ReactNode;
};

export default function SidebarCategory({ categoryName, returnButton, children }: Props) {
  return (
    <>
      <div className={styles.sidebarItemTop}>
        <div className={styles.sidebarItemTitle}>
          {returnButton && (
            <button className={styles.arrowBack} onClick={returnButton}>
              <Icon kind='arrowBack' width={18} height={16} color='#212121' />
            </button>
          )}
          {categoryName}
        </div>
      </div>

      {children}
    </>
  );
}
