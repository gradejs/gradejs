import React from 'react';
import NavigationCard from '../Card/NavigationCard';
import PopularPackageCard, { PopularPackageCardProps } from '../Card/PopularPackageCard';
import CardList from './CardList';

export type KeyedPopularPackageCardProps = PopularPackageCardProps & {
  id: string;
};

type Props = {
  cards: KeyedPopularPackageCardProps[];
};

const PopularPackageCardList = ({ cards }: Props) => {
  return (
    <CardList>
      {cards.map((card) => (
        <PopularPackageCard key={card.id} {...card} />
      ))}
      <NavigationCard title='Go to all Popular packages' to='/' />
    </CardList>
  );
};

export default PopularPackageCardList;
