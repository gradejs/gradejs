import React from 'react';
import styles from './Pagination.module.scss';
import clsx from 'clsx';

const Pagination = () => {
  return (
    <div className={styles.pagination}>
      <button className={clsx(styles.paginationButton, styles.paginationButtonActive)}>1</button>
      <button className={styles.paginationButton}>2</button>
      <button className={styles.paginationButton}>3</button>
      <button className={styles.paginationButton}>4</button>
      <button className={styles.paginationButton}>5</button>
      <div className={styles.paginationItem}>...</div>
      <button className={styles.paginationButton}>1234</button>
    </div>
  );
};

export default Pagination;
