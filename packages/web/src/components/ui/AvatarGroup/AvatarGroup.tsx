import React from 'react';
import styles from './AvatarGroup.module.scss';
import Avatar from '../Avatar/Avatar';

type Props = {
  max?: number;
  children: React.ReactNode;
};

const AvatarGroup = ({ max = 4, children: childrenProp }: Props) => {
  const children = React.Children.toArray(childrenProp).filter((child) =>
    React.isValidElement(child)
  );

  const totalAvatars = children.length;
  const clampedMax = Math.min(totalAvatars + 1, Math.max(max, 2));

  const maxAvatars = Math.min(totalAvatars, clampedMax - 1);
  const extraAvatars = Math.max(totalAvatars - clampedMax, totalAvatars - maxAvatars, 0);

  return (
    <div className={styles.avatars}>
      {extraAvatars ? (
        <div className={styles.avatarItem}>
          <Avatar variant='additionalAvatars'>+{extraAvatars}</Avatar>
        </div>
      ) : null}
      {children.slice(0, maxAvatars).map((child, index) => (
        <div key={index} className={styles.avatarItem}>
          {React.cloneElement(child as React.ReactElement)}
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
