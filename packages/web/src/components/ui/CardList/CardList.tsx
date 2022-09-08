import React from 'react';
import styles from './CardList.module.scss';
import Card, { CardProps } from '../Card/Card';
import clsx from 'clsx';
import Skeleton from '../Skeleton/Skeleton';

type Props = {
  cards: CardProps[];
  variant?: 'default' | 'vertical';
  loading?: boolean;
};

export default function CardList({ cards, variant = 'default', loading }: Props) {
  return (
    <div className={clsx(styles.grid, styles[variant])}>
      {loading ? (
        <>
          <Skeleton width='100%' variant='rounded'>
            <Card id='id1' title='title' />
          </Skeleton>
          <Skeleton width='100%' variant='rounded'>
            <Card id='id2' title='title' />
          </Skeleton>
          <Skeleton width='100%' variant='rounded'>
            <Card id='id3' title='title' />
          </Skeleton>
        </>
      ) : (
        cards.map((card) => <Card key={card.id} {...card} />)
      )}
    </div>
  );
}
