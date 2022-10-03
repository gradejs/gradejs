import React from 'react';
import styles from './AvatarGroup.module.scss';
import Avatar from '../Avatar/Avatar';

type Props = {
  max?: number;
  total?: number;
  children: React.ReactNode;
};

const AvatarGroup = ({ max = 5, total, children: childrenProp }: Props) => {
  const children = React.Children.toArray(childrenProp).filter((child) =>
    React.isValidElement(child)
  );

  let clampedMax = max < 2 ? 2 : max;
  const totalAvatars = total ?? children.length;

  if (totalAvatars === clampedMax) {
    clampedMax += 1;
  }

  clampedMax = Math.min(totalAvatars + 1, clampedMax);

  const maxAvatars = Math.min(children.length, clampedMax - 1);
  const extraAvatars = Math.max(totalAvatars - clampedMax, totalAvatars - maxAvatars, 0);

  return (
    <div className={styles.avatars}>
      {extraAvatars ? <Avatar variant='additionalAvatars'>+{extraAvatars}</Avatar> : null}
      {children
        .slice(0, maxAvatars)
        .map((child) => React.cloneElement(child as React.ReactElement))}
    </div>
  );
};

export default AvatarGroup;
