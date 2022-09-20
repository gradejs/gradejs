import React from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';

export type CardCommonProps = {
  id?: string;
  to?: string;
  title?: string;
  icon?: string;
  description?: string;
  variant?: 'placeholder' | 'small';
  children?: React.ReactNode;
};

const Card = ({ to, title, variant, icon, description, children }: CardCommonProps) => {
  const Tag = to ? 'a' : 'div';

  return (
    <Tag href={to ?? undefined} className={clsx(styles.card, variant && styles[variant])}>
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
};

export default Card;
