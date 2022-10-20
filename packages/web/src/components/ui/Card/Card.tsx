import React, { useMemo } from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

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
  const CardRoot: React.FC = useMemo(() => {
    const rootClassName = clsx(styles.card, variant && styles[variant]);

    if (to) {
      return ({ children: innerChildren }) => (
        <Link to={to} className={rootClassName}>
          {innerChildren}
        </Link>
      );
    }

    return ({ children: innerChildren }) => <div className={rootClassName}>{innerChildren}</div>;
  }, [to, variant]);

  return (
    <CardRoot>
      <div className={styles.cardTop}>
        <div className={styles.header}>
          {icon && (
            <div className={styles.iconWrapper}>
              <img className={styles.icon} src={icon} alt='' />
            </div>
          )}

          <div className={styles.title} title={title}>
            {title}
          </div>
        </div>

        {description && <div className={styles.description}>{description}</div>}
      </div>

      {children}
    </CardRoot>
  );
};

export default Card;
