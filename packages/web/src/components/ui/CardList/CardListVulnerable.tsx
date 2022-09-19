import React from 'react';
import styles from './CardList.module.scss';
import CardList from './CardList';
import CardVulnerable, { CardVulnerableProps } from '../Card/CardVulnerable';

type Props = {
  cards: CardVulnerableProps[];
};

const CardVulnerableList = ({ cards }: Props) => {
  return (
    <CardList className={styles.vertical}>
      {cards.map((card) => (
        <CardVulnerable key={card.id} {...card} />
      ))}
    </CardList>
  );
};

export default CardVulnerableList;
