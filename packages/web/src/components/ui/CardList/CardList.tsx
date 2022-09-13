import React from 'react';
import styles from './CardList.module.scss';
import Card, { CardProps } from '../Card/Card';
import clsx from 'clsx';
import { CardListSkeleton } from './CardListSkeleton';

type Props = {
  cards: CardProps[];
  variant?: 'default' | 'vertical';
  loading?: boolean;
};

export default function CardList({ cards, variant = 'default', loading }: Props) {
  return (
    <div className={clsx(styles.grid, styles[variant])}>
      {loading ? <CardListSkeleton /> : cards.map((card) => <Card key={card.id} {...card} />)}
    </div>
  );
}
