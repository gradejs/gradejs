import React from 'react';
import styles from './CardList.module.scss';
import clsx from 'clsx';

type Props = {
  variant?: 'vertical';
  children: React.ReactNode;
};

const CardList = ({ variant, children }: Props) => (
  <div className={clsx(styles.grid, variant)}>{children}</div>
);

export default CardList;
