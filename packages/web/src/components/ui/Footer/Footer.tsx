import React from 'react';
import styles from './Footer.module.scss';
import Container from '../Container/Container';

type FooterLink = {
  to: string;
  name: string;
};

export type FooterProps = {
  centerLinks: FooterLink[];
  rightLinks: FooterLink[];
};

export default function Footer({ centerLinks, rightLinks }: FooterProps) {
  return (
    <Container>
      <footer className={styles.footer}>
        <div className={styles.copyright}>© 2022 GradeJS. All rights reserved.</div>
        <div className={styles.wrapper}>
          <div className={styles.links}>
            {centerLinks.map(({ to, name }) => (
              <a key={name} href={to} className={styles.link}>
                {name}
              </a>
            ))}
          </div>
          <div className={styles.links}>
            {rightLinks.map(({ to, name }) => (
              <a key={name} href={to} className={styles.link}>
                {name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </Container>
  );
}
