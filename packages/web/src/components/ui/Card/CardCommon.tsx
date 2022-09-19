import React from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';

export interface CardCommonProps {
  as?: React.ElementType;
  id?: string;
  to?: string;
  title?: string;
  icon?: string;
  description?: string;
  variant?: 'link' | 'small';
  children?: React.ReactNode;
}

const CardCommon = ({
  as: Tag = 'div',
  to,
  title,
  variant,
  icon,
  description,
  children,
}: CardCommonProps) => (
  <Tag to={to} className={clsx(styles.card, variant && styles[variant])}>
    <div className={styles.cardTop}>
      <div className={styles.header}>
        {icon && (
          <div className={styles.iconWrapper}>
            <img className={styles.icon} src={icon} alt='' />
          </div>
        )}

        <div className={styles.title}>{title}</div>
      </div>

      {description && <div className={styles.description}>{description}</div>}
    </div>

    {children}
  </Tag>
);

export default CardCommon;
