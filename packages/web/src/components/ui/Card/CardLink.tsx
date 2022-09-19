import React from 'react';
import CardCommon, { CardCommonProps } from './CardCommon';
import styles from './Card.module.scss';
import { Icon } from '../Icon/Icon';

const CardLink = ({ title, to }: CardCommonProps) => (
  <CardCommon as='a' to={to} title={title} variant='link'>
    <button className={styles.arrowBtn}>
      <Icon kind='arrow' color='#212121' width={10} height={18} />
    </button>
  </CardCommon>
);

export default CardLink;
