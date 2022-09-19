import React from 'react';
import styles from './CardList.module.scss';
import clsx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const CardList = ({ className, children }: Props) => (
  <div className={clsx(styles.grid, className)}>{children}</div>
);

export default CardList;
