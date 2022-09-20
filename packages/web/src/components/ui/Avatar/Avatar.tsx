import React from 'react';
import styles from './Avatar.module.scss';

type Props = {
  src: string;
  alt?: string;
};

const Avatar = ({ src, alt = '' }: Props) => (
  <div className={styles.avatarItem}>
    <img src={src} className={styles.avatarImage} alt={alt} />
  </div>
);

export default Avatar;
