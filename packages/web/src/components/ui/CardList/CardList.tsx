import React from 'react';
import styles from './CardList.module.scss';
import Card, { CardProps } from '../Card/Card';
import clsx from 'clsx';

type Props = {
  cards: CardProps[];
  variant?: 'default' | 'vertical';
};

export default function CardList({ cards, variant = 'default' }: Props) {
  return (
    <div className={clsx(styles.grid, styles[variant])}>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
}
