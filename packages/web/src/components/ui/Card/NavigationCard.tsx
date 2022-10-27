import React from 'react';
import Card, { CardCommonProps } from './Card';
import styles from './Card.module.scss';
import { Icon } from '../Icon/Icon';

const NavigationCard = ({ title, to }: CardCommonProps) => (
  <Card to={to} title={title} variant='placeholder'>
    <button className={styles.arrowBtn}>
      <Icon kind='arrow' color='#212121' width={9} height={18} />
    </button>
  </Card>
);

export default NavigationCard;
