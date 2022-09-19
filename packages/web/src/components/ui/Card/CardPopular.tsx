import React from 'react';
import styles from './Card.module.scss';
import CardCommon, { CardCommonProps } from './CardCommon';
import AvatarGroup from '../AvatarGroup/AvatarGroup';
import Avatar from '../Avatar/Avatar';
import { formatNumber } from '../../../utils/helpers';

export interface CardPopularProps extends CardCommonProps {
  imagesList: string[];
  numberOfUses: number;
}

const CardPopular = ({ title, description, imagesList, numberOfUses }: CardPopularProps) => (
  <CardCommon title={title} description={description}>
    <div className={styles.avatarsWrapper}>
      <div className={styles.avatarSites}>
        <AvatarGroup>
          {imagesList.map((icon) => (
            <Avatar src={icon} />
          ))}
        </AvatarGroup>

        <div className={styles.counter}>+ {formatNumber(numberOfUses)} sites use</div>
      </div>
    </div>
  </CardCommon>
);

export default CardPopular;
