import React from 'react';
import styles from './AvatarGroup.module.scss';

type Props = {
  children: React.ReactNode;
};

const AvatarGroup = ({ children }: Props) => <div className={styles.avatars}>{children}</div>;

export default AvatarGroup;
