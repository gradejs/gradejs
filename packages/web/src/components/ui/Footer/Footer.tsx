import React from 'react';
import styles from './Footer.module.scss';
import Container from '../Container/Container';

export default function Footer() {
  return (
    <Container>
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <span className={styles.copyrightItem}>© 2022 GradeJS.</span>
        </div>
        <div className={styles.links}>
          <a
            href='https://github.com/gradejs/gradejs/discussions/6'
            target='_blank'
            rel='noreferrer'
            className={styles.link}
          >
            About
          </a>
          <a
            href='https://github.com/gradejs/gradejs/discussions'
            target='_blank'
            rel='noreferrer'
            className={styles.link}
          >
            Community
          </a>
          <a
            href='https://github.com/gradejs/gradejs/discussions/8'
            target='_blank'
            rel='noreferrer'
            className={styles.link}
          >
            Understanding accuracy
          </a>
          <a
            href='https://github.com/gradejs/gradejs'
            target='_blank'
            rel='noreferrer'
            className={styles.link}
          >
            Github
          </a>
        </div>
      </footer>
    </Container>
  );
}
