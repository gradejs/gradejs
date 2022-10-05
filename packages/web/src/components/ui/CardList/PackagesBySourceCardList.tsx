import React from 'react';
import CardList from './CardList';
import PackagesBySourceCard, { PackagesBySourceCardProps } from '../Card/PackagesBySourceCard';

export type KeyedPackagesBySourceCardProps = PackagesBySourceCardProps & {
  id: string;
};

type Props = {
  cards: KeyedPackagesBySourceCardProps[];
};

const PackagesBySourceCardList = ({ cards }: Props) => (
  <CardList>
    {cards.map((card) => (
      <PackagesBySourceCard key={card.id} {...card} />
    ))}
  </CardList>
);

export default PackagesBySourceCardList;
