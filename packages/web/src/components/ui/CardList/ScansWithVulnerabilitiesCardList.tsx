import React from 'react';
import CardList from './CardList';
import ScansWithVulnerabilitiesCard, {
  ScansWithVulnerabilitiesCardProps,
} from '../Card/ScansWithVulnerabilitiesCard';

export type KeyedScansWithVulnerabilitiesCardProps = ScansWithVulnerabilitiesCardProps & {
  id: string;
};

type Props = {
  cards: KeyedScansWithVulnerabilitiesCardProps[];
};

const ScansWithVulnerabilitiesCardList = ({ cards }: Props) => {
  return (
    <CardList variant='vertical'>
      {cards.map((card) => (
        <ScansWithVulnerabilitiesCard key={card.id} {...card} />
      ))}
    </CardList>
  );
};

export default ScansWithVulnerabilitiesCardList;
