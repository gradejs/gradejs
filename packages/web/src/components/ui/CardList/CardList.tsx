import React from 'react';
import styles from './CardList.module.scss';
import Card, { CardProps } from '../Card/Card';
import clsx from 'clsx';

export type CardListProps = {
  cards: CardProps[];
  variant?: 'default' | 'vertical' | string;
};

export default function CardList({ cards, variant = 'default' }: CardListProps) {
  const style = { '--total': cards.length } as React.CSSProperties;

  return (
    <div className={clsx(styles.grid, styles[variant])} style={style}>
      {cards.map((card) => (
        <Card key={card.title} {...card} />
      ))}
    </div>
  );
}
