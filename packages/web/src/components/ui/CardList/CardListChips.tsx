import React from 'react';
import CardList from './CardList';
import CardChips, { CardChipsProps } from '../Card/CardChips';

type Props = {
  cards: CardChipsProps[];
};

const CardListChips = ({ cards }: Props) => {
  return (
    <CardList>
      {cards.map((card) => (
        <CardChips key={card.id} {...card} />
      ))}
    </CardList>
  );
};

export default CardListChips;
