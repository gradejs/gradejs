import React from 'react';
import styles from './SidebarMeta.module.scss';
import { IconProps } from '../Icon/Icon';

type MetaItemProps = {
  icon: React.ReactElement<IconProps>;
  text: string;
};

type Props = {
  meta: MetaItemProps[];
};

function MetaItem({ icon, text }: MetaItemProps) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <span className={styles.metaText}>{text}</span>
    </div>
  );
}

export default function SidebarMeta({ meta }: Props) {
  return (
    <div className={styles.meta}>
      {meta.map((metaItem) => (
        <MetaItem key={metaItem.text} icon={metaItem.icon} text={metaItem.text} />
      ))}
    </div>
  );
}
