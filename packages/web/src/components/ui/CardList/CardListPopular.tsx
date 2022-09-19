import React from 'react';
import CardLink from '../Card/CardLink';
import CardPopular, { CardPopularProps } from '../Card/CardPopular';
import CardList from './CardList';

type Props = {
  cards: CardPopularProps[];
};

const CardListPopular = ({ cards }: Props) => {
  return (
    <CardList>
      {cards.map((card) => (
        <CardPopular key={card.id} {...card} />
      ))}
      <CardLink title='Go to all Popular packages' to='/' />
    </CardList>
  );
};

export default CardListPopular;
