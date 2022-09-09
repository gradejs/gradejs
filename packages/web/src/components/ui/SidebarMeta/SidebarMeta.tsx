import React from 'react';
import styles from './SidebarMeta.module.scss';
import { IconProps } from '../Icon/Icon';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from 'utils/helpers';

type MetaItemProps = {
  icon: React.ReactElement<IconProps>;
  text: string;
};

type Props = {
  meta: MetaItemProps[];
  loading?: boolean;
};

function MetaItem({ icon, text }: MetaItemProps) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <span className={styles.metaText}>{text}</span>
    </div>
  );
}

export default function SidebarMeta({ meta, loading }: Props) {
  return (
    <div className={styles.meta}>
      {loading
        ? repeat(
            5,
            <div className={styles.skeleton}>
              <Skeleton width={18} height={18} variant='circular' className={styles.skeletonIcon} />
              <Skeleton width='100%' />
            </div>
          )
        : meta.map((metaItem) => (
            <MetaItem key={metaItem.text} icon={metaItem.icon} text={metaItem.text} />
          ))}
    </div>
  );
}
